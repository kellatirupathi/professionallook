import { useEffect, useRef } from "react";
import ImageGenerator from "./ImageGenerator";

function TypingIndicator({ label }) {
  return (
    <div className="animate-msg-in flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-3.5">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.32s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.16s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
        </span>
        {label ? <span className="text-xs text-zinc-500">{label}</span> : null}
      </div>
    </div>
  );
}

function ImageUploadBubble({ message }) {
  const src = message.imageDataUrl;
  if (!src) return null;
  return (
    <div className="animate-msg-in flex justify-end">
      <div className="w-52 overflow-hidden rounded-2xl rounded-tr-sm shadow-sm sm:w-60">
        <img src={src} alt={message.content} className="w-full object-cover" />
        <div className="bg-zinc-900 px-3 py-2">
          <p className="truncate text-xs text-zinc-400">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

function AnalysisCardMessage({ analysis }) {
  if (!analysis || analysis.imageQuality === "unclear") return null;
  return (
    <div className="animate-msg-in w-full">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        Analysis Snapshot
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Presentation
          </p>
          <p className="mt-1 text-sm font-medium capitalize text-zinc-900">
            {analysis.presentation}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Beard
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-900">
            {analysis.beardApplicable ? "Applicable" : "Not applicable"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Style Focus
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-zinc-900">
            {analysis.styleFocus || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ImageBatchMessage({ message }) {
  const total = message.items?.length ?? 0;
  const completed = message.items?.filter((i) => i.status === "complete").length ?? 0;
  const inFlight = message.items?.find((i) => i.status === "generating");

  return (
    <div className="animate-msg-in w-full">
      <p className="mb-3 text-xs font-medium text-zinc-500">
        {inFlight
          ? `Generating ${inFlight.report} (${completed + 1}/${total})`
          : completed === total
            ? `${total} image${total > 1 ? "s" : ""} ready`
            : `${completed}/${total} complete`}
      </p>
      <ImageGenerator items={message.items} />
    </div>
  );
}

function TextBubble({ message }) {
  const isAssistant = message.role === "assistant";
  const isStreamingEmpty = message.streaming && !message.content;
  const isStreamingFilling = message.streaming && message.content;

  return (
    <div className={`animate-msg-in flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-md sm:px-5 ${
          isAssistant
            ? "rounded-tl-sm bg-zinc-100 text-zinc-900"
            : "rounded-tr-sm bg-zinc-900 text-white"
        }`}
      >
        {isAssistant && message.title ? (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            {message.title}
          </p>
        ) : null}

        {isStreamingEmpty ? (
          <span className="flex items-center gap-1.5 py-0.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.32s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.16s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
          </span>
        ) : (
          <p className={`whitespace-pre-wrap ${isStreamingFilling ? "streaming-cursor" : ""}`}>
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}

function MessageRenderer({ message }) {
  switch (message.type) {
    case "image_upload":
      return <ImageUploadBubble message={message} />;
    case "analysis_card":
      return <AnalysisCardMessage analysis={message.analysis} />;
    case "image_batch":
      return <ImageBatchMessage message={message} />;
    default:
      return <TextBubble message={message} />;
  }
}

export default function ChatWindow({ messages, appError, isAnalyzing }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnalyzing]);

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <MessageRenderer key={message.id} message={message} />
      ))}

      {isAnalyzing ? <TypingIndicator label="Analysing portrait" /> : null}

      {appError ? (
        <div className="animate-msg-in rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {appError}
        </div>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
}
