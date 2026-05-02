export default function ReportSelector({
  reports,
  selectedReports,
  disabled,
  onToggleReport,
  onGenerate,
}) {
  if (!reports.length) return null;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Relevant Reports
          </p>
          <p className="mt-1.5 text-sm text-zinc-500">
            Select categories — each generates a separate styled image.
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={!selectedReports.length || disabled}
          className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Generate
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {reports.map((report) => {
          const active = selectedReports.includes(report);
          return (
            <button
              key={report}
              type="button"
              onClick={() => onToggleReport(report)}
              disabled={disabled}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-white"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {report}
            </button>
          );
        })}
      </div>
    </section>
  );
}
