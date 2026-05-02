export default function ImageUploader({
  isOpen,
  previewUrl,
  fileName,
  disabled,
  fileInputRef,
  onToggle,
  onSelectFile,
  onFileChange,
}) {
  return (
    <div className="relative mb-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={onFileChange}
        disabled={disabled}
      />

      {isOpen ? (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Upload portrait</p>
              <p className="text-xs text-zinc-500">JPG, PNG or WEBP · max 20 MB</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Close
            </button>
          </div>

          <div className="p-3">
            <button
              type="button"
              onClick={onSelectFile}
              disabled={disabled}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-left transition hover:border-zinc-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {previewUrl ? "Replace portrait" : "Choose portrait"}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">Select an image file</p>
              </div>
              <span className="text-zinc-400">↗</span>
            </button>

            {previewUrl ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200">
                <img
                  src={previewUrl}
                  alt={fileName || "Current portrait"}
                  className="h-32 w-full object-cover"
                />
                {fileName ? (
                  <p className="truncate border-t border-zinc-100 bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
                    {fileName}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
