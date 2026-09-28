import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, X } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import ErrorState from "../common/ErrorState";
import Loading from "../common/Loading";
import { useTranslation } from "../../i18n/useTranslation";

export default function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"opening" | "ready" | "error">("opening");
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setError("Camera access is unavailable. You can upload a crop photo from your device instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setStream(stream);
      setStatus("ready");
    } catch {
      stopCamera();
      setStatus("error");
      setError("Camera access was not granted. You can upload a crop photo from your device instead.");
    }
  }, [stopCamera]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void startCamera();
    });
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    void video.play().catch(() => {
      setStatus("error");
      setError("Camera preview could not start. Please try again or upload a crop photo instead.");
    });

    return () => {
      if (video.srcObject === stream) video.srcObject = null;
    };
  }, [stream]);

  const capture = () => {
    const video = videoRef.current;
    if (!stream || !stream.active || !video || video.srcObject !== stream) {
      setError("The camera preview is not ready yet. Please restart the camera and try again.");
      setStatus("error");
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("The camera has not produced an image yet. Please wait a moment and try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus("error");
        setError("We couldn't capture that image. Please try again or upload a photo instead.");
        return;
      }
      stopCamera();
      onCapture(new File([blob], `crop-photo-${Date.now()}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);
  };

  return (
    <Card className="overflow-hidden border-command/20 p-0">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-forest-700" />
          <div>
            <p className="font-semibold text-ink">{t("Take a crop photo")}</p>
            <p className="text-xs text-ink-soft">{t("Use the rear camera for a clear leaf image.")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          aria-label={t("Close camera")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {status === "opening" && <Loading message="Opening camera..." />}
      {status === "error" && (
        <div className="px-5 py-6 sm:px-6">
          <ErrorState
            message={error ?? "Camera access is unavailable."}
            onRetry={() => {
              setStatus("opening");
              void startCamera();
            }}
          />
          <Button variant="secondary" fullWidth onClick={onClose}>
            {t("Use upload instead")}
          </Button>
        </div>
      )}
      {status === "ready" && (
        <div className="p-4 sm:p-6">
          <div className="overflow-hidden rounded-xl bg-command">
            <video
              ref={videoRef}
              className="aspect-[4/3] w-full object-cover"
              autoPlay
              muted
              playsInline
              aria-label="Live camera preview of your crop"
            />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button fullWidth size="lg" icon={<Camera className="h-4 w-4" />} onClick={capture}>
              Capture photo
            </Button>
            <Button
              variant="ghost"
              fullWidth
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={() => {
                setStatus("opening");
                void startCamera();
              }}
            >
              Restart camera
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}