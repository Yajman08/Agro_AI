import { useCallback, useRef, useState } from "react";
import { UploadCloud, Camera, ImagePlus } from "lucide-react";
import { clsx } from "../../lib/clsx";
import { validateImageFile } from "./imageValidation";
import { useTranslation } from "../../i18n/useTranslation";

export default function ImageUploader({
  onSelect,
  onError,
  onRequestCamera,
}: {
  onSelect: (file: File) => void;
  onError: (message: string) => void;
  onRequestCamera: () => void;
}) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;

      const error = validateImageFile(file);
      if (error) {
        onError(error);
        return;
      }

      onError("");
      onSelect(file);
    },
    [onError, onSelect]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={clsx(
        "rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-colors",
        dragActive ? "border-forest-500 bg-forest-50" : "border-line bg-surface"
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 text-forest-600">
          <UploadCloud className="h-6 w-6" />
        </span>
        <div>
          <p className="font-medium text-ink">{t("Drag and drop a leaf photo here")}</p>
          <p className="text-sm text-ink-soft mt-1">{t("or choose an option below")}</p>
        </div>

        <div className="grid w-full gap-3 mt-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onRequestCamera}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 text-white px-5 py-2.5 text-sm font-medium hover:bg-forest-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 transition-colors"
          >
            <Camera className="h-4 w-4" />
            {t("Take photo")}
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface text-ink px-5 py-2.5 text-sm font-medium hover:border-forest-500 hover:text-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 transition-colors"
          >
            <ImagePlus className="h-4 w-4" />
            {t("Upload photo")}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          aria-label="Upload a photo of a crop leaf"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.currentTarget.value = "";
          }}
        />
      </div>
    </div>
  );
}
