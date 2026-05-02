import { useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ImageUploader from "./components/ImageUploader";
import ReportSelector from "./components/ReportSelector";
import { analyzeImage, chatStream, generateReportImage } from "./lib/openai";
import { normalizeRelevantReports } from "./lib/reporting";
import { composeEditorialReport } from "./lib/composer";

const STORAGE_KEY = "professional-fashion-report-chats";
// 3 RPM allowance for gpt-image-1 + each call takes ~20-30s anyway, so no
// artificial delay between images is needed.
const IMAGE_REQUEST_DELAY_MS = 0;

const CONVERSATION_STARTERS = [
  {
    id: "analyse",
    title: "Analyse my portrait",
    description: "Get face, hair, and colour insights for professional styling.",
  },
  {
    id: "colour",
    title: "Colour analysis",
    description: "Discover your season, palette, and best professional shades.",
  },
  {
    id: "complete",
    title: "Full style package",
    description: "Hair, dress, footwear, and accessories guides in one session.",
  },
];

function createWelcomeMessages() {
  // Empty — the centred hero in the initial-state view is the welcome.
  // No bubble is added, so a brand-new chat opens completely clean.
  return [];
}

function createSession() {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    messages: createWelcomeMessages(),
    uploadedFileName: "",
    imageDataUrl: "",
    analysis: null,
    relevantReports: [],
    selectedReports: [],
  };
}

function makeMessage(role, content, title = "", type = "") {
  return { id: `${role}-${crypto.randomUUID()}`, role, title, content, type };
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read the uploaded file."));
    reader.readAsDataURL(file);
  });
}

function formatHistoryDate(isoString) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(
    new Date(isoString),
  );
}

function StatusDot({ status }) {
  const cls =
    status === "ready"
      ? "bg-emerald-500"
      : status === "error"
        ? "bg-red-500"
        : "animate-pulse bg-amber-400";
  return <span className={`h-1.5 w-1.5 rounded-full ${cls}`} />;
}

function ComposerActionIcon({ busy }) {
  if (busy) {
    return (
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </span>
    );
  }

  return <span className="text-xl font-light leading-none">↑</span>;
}

export default function App() {
  const [sessions, setSessions] = useState(() => [createSession()]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [knowledgeStatus, setKnowledgeStatus] = useState("loading");
  const [knowledgeText, setKnowledgeText] = useState("");
  const [knowledgeJson, setKnowledgeJson] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [composerValue, setComposerValue] = useState("");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [appError, setAppError] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreview, setPendingPreview] = useState("");
  const fileInputRef = useRef(null);

  // ── URL helpers ─────────────────────────────────────────────────────────
  const urlSyncedRef = useRef(false);

  function readSessionIdFromUrl() {
    if (typeof window === "undefined") return null;
    const m = window.location.pathname.match(/^\/c\/([0-9a-fA-F-]{6,})$/);
    return m?.[1] ?? null;
  }

  // ── Persist & load sessions ───────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let loaded = null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) loaded = parsed;
      } catch {
        loaded = null;
      }
    }
    if (!loaded) loaded = [createSession()];

    setSessions(loaded);

    // Honour /c/<id> from the URL when it points at a known session.
    const urlId = readSessionIdFromUrl();
    const targetId =
      urlId && loaded.some((s) => s.id === urlId) ? urlId : loaded[0].id;
    setActiveSessionId(targetId);

    // Normalise the URL without creating a history entry on first load.
    const targetPath = `/c/${targetId}`;
    if (window.location.pathname !== targetPath) {
      window.history.replaceState({}, "", targetPath);
    }
    urlSyncedRef.current = true;
  }, []);

  // Push a new history entry whenever the user switches / creates / deletes a chat.
  useEffect(() => {
    if (!urlSyncedRef.current || !activeSessionId) return;
    const targetPath = `/c/${activeSessionId}`;
    if (window.location.pathname === targetPath) return;
    window.history.pushState({}, "", targetPath);
  }, [activeSessionId]);

  // Browser back / forward navigates between chats.
  useEffect(() => {
    function onPop() {
      const id = readSessionIdFromUrl();
      if (id) setActiveSessionId(id);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!sessions.length) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 1)));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [sessions]);

  // ── Load knowledge base ───────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [ir, kr] = await Promise.all([
          fetch("/knowledgebase/instructions.md"),
          fetch("/knowledgebase/Grooming%20knowledge_base.json"),
        ]);
        if (!ir.ok || !kr.ok) throw new Error("Knowledgebase files could not be loaded.");
        const iText = await ir.text();
        const kRaw = await kr.text();
        setInstructions(iText);
        setKnowledgeText(kRaw);
        setKnowledgeJson(JSON.parse(kRaw));
        setKnowledgeStatus("ready");
      } catch (e) {
        setKnowledgeStatus("error");
        setAppError(e.message);
      }
    }
    load();
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────
  const activeSession = useMemo(
    () =>
      sessions.find((s) => s.id === activeSessionId) ?? sessions[0] ?? createSession(),
    [sessions, activeSessionId],
  );

  // Only show the centred hero / starters when nothing has happened yet:
  // no portrait uploaded AND no messages in this chat.
  const isInitialState =
    !activeSession.imageDataUrl && activeSession.messages.length === 0;
  const hasDraftText = Boolean(composerValue.trim());
  const hasPendingAttachment = Boolean(pendingPreview);
  const hasAttachedImage = Boolean(activeSession.imageDataUrl);
  const hasSelectedReports = Boolean(activeSession.selectedReports.length);
  const isComposerBusy = isAnalyzing || isGenerating || isChatting;

  const composerDisabled = knowledgeStatus !== "ready" || isComposerBusy;

  const showComposerActionButton =
    isComposerBusy ||
    hasDraftText ||
    hasPendingAttachment ||
    hasAttachedImage ||
    hasSelectedReports;

  const composerPlaceholder = pendingPreview
    ? "Press send to analyse your portrait"
    : isInitialState
      ? "Upload a portrait with + to begin"
      : !activeSession.analysis
        ? "Press send to analyze the uploaded image"
        : activeSession.analysis.imageQuality === "unclear"
          ? "Upload a clearer portrait to continue"
          : "Select report chips, then press send to generate";

  // ── Session helpers ───────────────────────────────────────────────────────
  function updateActiveSession(updater) {
    setSessions((cur) =>
      cur.map((s) =>
        s.id === activeSessionId
          ? { ...updater(s), updatedAt: new Date().toISOString() }
          : s,
      ),
    );
  }

  function addAssistantMessage(content, title = "") {
    updateActiveSession((s) => ({
      ...s,
      messages: [...s.messages, makeMessage("assistant", content, title)],
    }));
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  function handleDeleteSession(sessionId) {
    const isActive = sessionId === activeSessionId;
    setSessions((cur) => {
      const remaining = cur.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const fresh = createSession();
        if (isActive) setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (isActive) setActiveSessionId(remaining[0].id);
      return remaining;
    });
    if (isActive) {
      setUploadedFile(null);
      setPendingFile(null);
      setPendingPreview("");
      setComposerValue("");
      setAppError("");
    }
  }

  function handleNewChat() {
    const next = createSession();
    setSessions((cur) => [next, ...cur]);
    setActiveSessionId(next.id);
    setUploadedFile(null);
    setPendingFile(null);
    setPendingPreview("");
    setComposerValue("");
    setAppError("");
    setIsUploaderOpen(false);
  }

  async function handleChooseFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAppError("");
    const dataUrl = await readFileAsDataUrl(file);
    // Stage the upload as a pending attachment — commit happens on Send.
    setPendingFile(file);
    setPendingPreview(dataUrl);
    setIsUploaderOpen(false);
    event.target.value = "";
  }

  function clearPendingAttachment() {
    setPendingFile(null);
    setPendingPreview("");
  }

  async function runAnalysis(explicitDataUrl) {
    const dataUrl = explicitDataUrl ?? activeSession.imageDataUrl;
    if (!dataUrl || knowledgeStatus !== "ready") return;
    setIsAnalyzing(true);
    setAppError("");
    try {
      const result = await analyzeImage({
        imageDataUrl: dataUrl,
        instructions,
        knowledgeText,
      });
      const normalized =
        result.imageQuality === "unclear"
          ? []
          : normalizeRelevantReports(result.relevantReports, Boolean(result.beardApplicable));

      const newMessage =
        result.imageQuality === "unclear"
          ? makeMessage(
              "assistant",
              `The image is not clear enough for a reliable styling report. ${result.qualityReason}`,
              "Image Quality",
            )
          : {
              id: `assistant-${crypto.randomUUID()}`,
              role: "assistant",
              type: "analysis_card",
              analysis: result,
            };

      updateActiveSession((s) => ({
        ...s,
        analysis: result,
        relevantReports: normalized,
        selectedReports: normalized.slice(0, Math.min(2, normalized.length)),
        messages: [...s.messages, newMessage],
      }));
    } catch (e) {
      setAppError(e.message);
      addAssistantMessage(e.message, "Analysis Error");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleToggleReport(report) {
    updateActiveSession((s) => ({
      ...s,
      selectedReports: s.selectedReports.includes(report)
        ? s.selectedReports.filter((r) => r !== report)
        : [...s.selectedReports, report],
    }));
  }

  async function runGeneration() {
    if (!activeSession.analysis || !activeSession.selectedReports.length || !knowledgeJson)
      return;
    setIsGenerating(true);
    setAppError("");

    const selectedReports = [...activeSession.selectedReports];
    const batchId = `batch-${crypto.randomUUID()}`;

    // Append a single image_batch message; items mutate in place as work progresses.
    const initialItems = selectedReports.map((report, i) => ({
      report,
      status: i === 0 ? "generating" : "queued",
      imageUrl: "",
      error: "",
    }));

    updateActiveSession((s) => ({
      ...s,
      messages: [
        ...s.messages,
        { id: batchId, role: "assistant", type: "image_batch", items: initialItems },
      ],
    }));

    function patchBatchItems(updater) {
      updateActiveSession((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === batchId ? { ...m, items: updater(m.items) } : m,
        ),
      }));
    }

    for (const [index, reportType] of selectedReports.entries()) {
      if (index > 0) {
        patchBatchItems((items) =>
          items.map((it) =>
            it.report === reportType ? { ...it, status: "generating" } : it,
          ),
        );
      }

      try {
        // Step 1 (Path A): face-preserving AI hero via /images/edits.
        const result = await generateReportImage({
          reportType,
          uploadedFile,
          imageDataUrl: activeSession.imageDataUrl,
          instructions,
          knowledge: knowledgeJson,
          analysis: activeSession.analysis,
        });

        // Step 2 (Path B): compose editorial poster around the AI hero
        //   (title bar + hero + recommended panel + tips + avoid + footer).
        let finalImageUrl = result.imageUrl;
        try {
          finalImageUrl = await composeEditorialReport({
            reportType,
            heroImageUrl: result.imageUrl,
            analysis: activeSession.analysis,
          });
        } catch (composeErr) {
          // If composition fails, fall back to the raw AI hero.
          console.warn("[runGeneration] compose failed:", composeErr.message);
        }

        patchBatchItems((items) =>
          items.map((it) =>
            it.report === reportType
              ? {
                  ...it,
                  status: "complete",
                  imageUrl: finalImageUrl,
                  revisedPrompt: result.revisedPrompt,
                }
              : it,
          ),
        );
      } catch (e) {
        patchBatchItems((items) =>
          items.map((it) =>
            it.report === reportType ? { ...it, status: "error", error: e.message } : it,
          ),
        );
      }

      if (index < selectedReports.length - 1) {
        await sleep(IMAGE_REQUEST_DELAY_MS);
      }
    }

    setIsGenerating(false);
  }

  async function runChat(userText) {
    if (!userText) return;

    const streamingId = `assistant-${crypto.randomUUID()}`;

    // Append the user message and an empty streaming assistant bubble in one update.
    updateActiveSession((s) => ({
      ...s,
      messages: [
        ...s.messages,
        makeMessage("user", userText),
        {
          id: streamingId,
          role: "assistant",
          title: "",
          content: "",
          type: "",
          streaming: true,
        },
      ],
    }));

    setIsChatting(true);
    setAppError("");

    try {
      await chatStream({
        userMessage: userText,
        history: activeSession.messages,
        onChunk: (delta) => {
          updateActiveSession((s) => ({
            ...s,
            messages: s.messages.map((m) =>
              m.id === streamingId ? { ...m, content: m.content + delta } : m,
            ),
          }));
        },
      });
      // Stream finished cleanly — drop the streaming flag.
      updateActiveSession((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === streamingId ? { ...m, streaming: false } : m,
        ),
      }));
    } catch (e) {
      setAppError(e.message);
      updateActiveSession((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === streamingId
            ? {
                ...m,
                content: m.content || `Sorry — ${e.message}`,
                streaming: false,
              }
            : m,
        ),
      }));
    } finally {
      setIsChatting(false);
    }
  }

  async function handleSend() {
    if (isAnalyzing || isGenerating || isChatting) return;

    // Commit a pending attachment + start analysis in one Send.
    if (pendingFile && pendingPreview) {
      const file = pendingFile;
      const dataUrl = pendingPreview;
      setPendingFile(null);
      setPendingPreview("");
      setUploadedFile(file);

      updateActiveSession((s) => ({
        ...s,
        title: s.title && s.title !== "New chat"
          ? s.title
          : file.name.replace(/\.[^.]+$/, "") || "Image report",
        uploadedFileName: file.name,
        imageDataUrl: dataUrl,
        analysis: null,
        relevantReports: [],
        selectedReports: [],
        // Append, don't replace — preserve full conversation history.
        // Embed dataUrl on the message so each upload bubble keeps its own image.
        messages: [
          ...s.messages,
          {
            id: `user-${crypto.randomUUID()}`,
            role: "user",
            type: "image_upload",
            content: file.name,
            imageDataUrl: dataUrl,
            title: "",
          },
        ],
      }));
      setComposerValue("");
      await runAnalysis(dataUrl);
      return;
    }

    if (composerValue.trim()) {
      const userText = composerValue.trim();
      setComposerValue("");
      // Set the chat title from the first user message if still default.
      updateActiveSession((s) =>
        !s.title || s.title === "New chat"
          ? { ...s, title: userText.slice(0, 60) }
          : s,
      );
      await runChat(userText);
      return;
    }
    if (!activeSession.imageDataUrl) {
      addAssistantMessage("Upload a portrait using the + button to get started.");
      return;
    }
    if (!activeSession.analysis) {
      await runAnalysis();
      return;
    }
    if (activeSession.analysis.imageQuality === "unclear") {
      addAssistantMessage("Please upload a clearer portrait to continue.");
      return;
    }
    if (!activeSession.selectedReports.length) {
      addAssistantMessage("Select at least one report category before generating.");
      return;
    }
    await runGeneration();
  }

  // ── Shared composer JSX ───────────────────────────────────────────────────
  const composerBar = (
    <div className="relative">
      <ImageUploader
        isOpen={isUploaderOpen}
        previewUrl={pendingPreview || activeSession.imageDataUrl}
        fileName={pendingFile?.name || activeSession.uploadedFileName}
        disabled={composerDisabled}
        fileInputRef={fileInputRef}
        onToggle={() => setIsUploaderOpen((c) => !c)}
        onSelectFile={() => fileInputRef.current?.click()}
        onFileChange={handleChooseFile}
      />

      {/* Pending attachment preview — appears immediately above the input */}
      {pendingPreview ? (
        <div className="animate-msg-in mb-2 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm">
          <img
            src={pendingPreview}
            alt={pendingFile?.name ?? "attachment"}
            className="h-12 w-12 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900">
              {pendingFile?.name ?? "Portrait"}
            </p>
            <p className="text-xs text-zinc-500">Ready to send</p>
          </div>
          <button
            type="button"
            onClick={clearPendingAttachment}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Remove attachment"
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-3 w-3"
            >
              <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : null}

      {/* Single unified input box — buttons live inside, not alongside */}
      <div className="flex items-end gap-1 rounded-3xl border border-zinc-200 bg-white px-2 py-2 shadow-sm">
        <button
          type="button"
          onClick={() => setIsUploaderOpen((c) => !c)}
          disabled={composerDisabled}
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="text-xl font-light leading-none">+</span>
        </button>
        <div className="min-w-0 flex-1 py-1.5 pl-1">
          <textarea
            rows={1}
            value={composerValue}
            onChange={(e) => setComposerValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!composerDisabled) handleSend();
              }
            }}
            placeholder={composerPlaceholder}
            className="max-h-36 w-full resize-none border-0 bg-transparent text-sm leading-6 text-zinc-900 outline-none placeholder:text-zinc-400"
          />
        </div>
        {showComposerActionButton ? (
          <button
            type="button"
            onClick={handleSend}
            disabled={composerDisabled}
            aria-label={isComposerBusy ? "Generating" : "Send"}
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            <ComposerActionIcon busy={isComposerBusy} />
          </button>
        ) : (
          <div className="mb-0.5 h-9 w-9 shrink-0" aria-hidden="true" />
        )}
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-white text-zinc-900 antialiased">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChooseFile}
        disabled={composerDisabled}
      />

      {/* ── Left sidebar (desktop) ─────────────────────────────────────── */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 lg:flex">
        {/* Brand */}
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4 py-[18px]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900">
            <span className="text-xs font-bold text-white">PI</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            Image Report
          </span>
        </div>

        {/* New chat */}
        <div className="px-3 pt-3 pb-2">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            <span className="text-base font-light leading-none">+</span>
            New chat
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-1">
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            History
          </p>
          <div className="space-y-0.5">
            {sessions.map((session) => {
              const active = session.id === activeSessionId;
              return (
                <div key={session.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setUploadedFile(null);
                      setPendingFile(null);
                      setPendingPreview("");
                      setComposerValue("");
                      setAppError("");
                    }}
                    className={`w-full rounded-xl px-3 py-2.5 pr-8 text-left text-sm transition ${
                      active
                        ? "bg-zinc-200 font-medium text-zinc-900"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <p className="truncate leading-tight">{session.title || "New chat"}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-400">
                      {formatHistoryDate(session.updatedAt)}
                    </p>
                  </button>

                  {/* Delete button — visible on hover */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-lg text-zinc-400 opacity-0 transition hover:bg-zinc-300 hover:text-zinc-700 group-hover:opacity-100"
                    aria-label="Delete session"
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                      <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status footer */}
        <div className="flex items-center gap-2 border-t border-zinc-200 px-4 py-3">
          <StatusDot status={knowledgeStatus} />
          <span className="text-[11px] capitalize text-zinc-400">{knowledgeStatus}</span>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900">
              <span className="text-xs font-bold text-white">PI</span>
            </div>
            <span className="text-sm font-semibold text-zinc-900">Image Report</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status={knowledgeStatus} />
            <button
              type="button"
              onClick={handleNewChat}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
            >
              New chat
            </button>
          </div>
        </div>

        {isInitialState ? (
          /* ── Initial / empty state ─────────────────────────────────── */
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10 sm:px-6">
            <div className="w-full max-w-xl">
              {/* Hero */}
              <div className="mb-8 text-center">
                <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Professional Image Report
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
                  Upload your portrait for a personalised professional styling and wardrobe
                  assessment.
                </p>
              </div>

              {/* Composer (centered) */}
              {composerBar}

              {/* Conversation starters — below the input. Hidden once a file is attached. */}
              {!pendingPreview ? (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {CONVERSATION_STARTERS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={composerDisabled}
                      onClick={() => setComposerValue(s.title)}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-left transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <p className="text-sm font-medium text-zinc-900">{s.title}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{s.description}</p>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          /* ── Chat state ─────────────────────────────────────────────── */
          <>
            {/* Scrollable messages */}
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                <ChatWindow
                  messages={activeSession.messages}
                  appError={appError}
                  isAnalyzing={isAnalyzing}
                />

                {activeSession.analysis &&
                activeSession.analysis.imageQuality !== "unclear" ? (
                  <div className="mt-5">
                    <ReportSelector
                      reports={activeSession.relevantReports}
                      selectedReports={activeSession.selectedReports}
                      disabled={isGenerating}
                      onToggleReport={handleToggleReport}
                      onGenerate={handleSend}
                    />
                  </div>
                ) : null}

                {/* bottom scroll anchor */}
                <div className="h-2" />
              </div>
            </div>

            {/* Sticky bottom composer */}
            <div className="shrink-0 border-t border-zinc-100 bg-white px-4 pb-5 pt-3 sm:px-6">
              <div className="mx-auto max-w-5xl">{composerBar}</div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
