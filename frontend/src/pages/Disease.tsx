import { useEffect, useState } from "react";
import { MapPin, Ruler, Wheat } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import ImageUploader from "../components/disease/ImageUploader";
import CameraCapture from "../components/disease/CameraCapture";
import DiseaseResultView from "../components/disease/DiseaseResultView";
import { validateImageFile } from "../components/disease/imageValidation";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import { useFarmer } from "../context/useFarmer";
import { detectDisease } from "../services/api";
import type { DiseaseResult, RequestState } from "../types";
import { Camera, ImagePlus, RotateCcw, X } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";

export default function Disease() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [state, setState] = useState<RequestState>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [fileSource, setFileSource] = useState<"upload" | "camera">("upload");
  const { profile, error: profileError, reloadProfile } = useFarmer();
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSelect = (selected: File, source: "upload" | "camera") => {
    const fileError = validateImageFile(selected);
    if (fileError) {
      setValidationError(fileError);
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setState("idle");
    setValidationError(null);
    setFileSource(source);
    setCameraOpen(false);
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setState("idle");
    setValidationError(null);
    setCameraOpen(false);
  };

  const replacePhoto = () => {
    reset();
  };

  const retakePhoto = () => {
    reset();
    setCameraOpen(true);
  };

  const analyze = async () => {
    if (!file) return;
    setState("loading");
    try {
      const res = await detectDisease(file);
      setResult(res);
      setState("success");
    } catch {
      setState("error");
    }
  };

  return (
    <AppLayout>
      <Header
        title="Crop health intelligence"
        subtitle="Screen a crop image for possible visible disease signs."
      />

      {profileError && <ErrorState message={profileError} onRetry={reloadProfile} />}

      <div className="max-w-3xl space-y-8 pb-4">
        <DiseaseFarmContext
          name={profile?.name ?? "Farmer profile loading"}
          location={profile ? `${profile.location.village}, ${profile.location.district}, ${profile.location.state}` : "Farm location loading"}
          crop={profile?.currentCrop ?? "Current crop pending"}
          farmSize={profile?.farm.sizeAcres}
        />

        {!file && (
          <>
            {cameraOpen ? (
              <CameraCapture
                onCapture={(capturedFile) => handleSelect(capturedFile, "camera")}
                onClose={() => setCameraOpen(false)}
              />
            ) : (
              <ImageUploader
                onSelect={(selectedFile) => handleSelect(selectedFile, "upload")}
                onError={setValidationError}
                onRequestCamera={() => setCameraOpen(true)}
              />
            )}
            {validationError && (
              <ErrorState message={validationError} />
            )}
          </>
        )}

        {file && previewUrl && state !== "success" && (
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{t("Image to screen")}</p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {t(fileSource === "camera" ? "Captured crop photo" : "Uploaded crop photo")}
                </p>
              </div>
              <span className="text-xs text-ink-soft">{t("Clear leaf image recommended")}</span>
            </div>
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img src={previewUrl} alt={`${fileSource === "camera" ? "Captured" : "Uploaded"} crop leaf to screen`} className="w-full max-h-80 object-contain bg-command" />
              <button
                onClick={reset}
                aria-label="Remove photo"
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {state === "loading" ? (
              <Loading message="Analyzing crop image..." />
            ) : state === "error" ? (
              <ErrorState message="We couldn't analyze this photo." onRetry={analyze} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                <Button fullWidth size="lg" icon={<Camera className="h-4 w-4" />} onClick={analyze}>
                  Analyze photo
                </Button>
                <Button variant="secondary" fullWidth icon={<RotateCcw className="h-4 w-4" />} onClick={retakePhoto}>
                  Retake
                </Button>
                <Button variant="ghost" fullWidth icon={<ImagePlus className="h-4 w-4" />} onClick={replacePhoto}>
                  Upload another
                </Button>
              </div>
            )}
          </Card>
        )}

        {result && state === "success" && (
          <div className="space-y-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Analyzed crop leaf"
                className="w-full max-h-64 object-contain rounded-xl bg-command"
              />
            )}
            <DiseaseResultView result={result} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" />} onClick={retakePhoto}>
                Retake photo
              </Button>
              <Button variant="ghost" icon={<ImagePlus className="h-4 w-4" />} onClick={replacePhoto}>
                Upload another photo
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function DiseaseFarmContext({
  name,
  location,
  crop,
  farmSize,
}: {
  name: string;
  location: string;
  crop: string;
  farmSize?: number;
}) {
  const { t } = useTranslation();
  return (
    <section className="border-y border-line py-4" aria-label="Farm crop health context">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{t("Screening this farm")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink"><MapPin className="h-3.5 w-3.5 text-sienna-700" />{name}&apos;s farm · {location}</span>
            <span className="inline-flex items-center gap-1.5 text-ink-soft"><Wheat className="h-3.5 w-3.5 text-forest-700" />{crop}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft"><Ruler className="h-3.5 w-3.5" />{farmSize ? `${farmSize} acres` : t("Farm size pending")}</span>
      </div>
    </section>
  );
}
