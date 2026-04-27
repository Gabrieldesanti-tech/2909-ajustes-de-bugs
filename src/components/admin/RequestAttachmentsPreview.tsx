"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Paperclip,
  PlayCircle,
  X,
} from "lucide-react";
import { apiPost, type ApiEnvelope, unwrapData } from "@/lib/api";
import type { RequestAttachment } from "@/types";

type AttachmentKind = "image" | "video" | "file";
type AttachmentAccessStatus = "idle" | "loading" | "ready" | "error";

interface AttachmentAccessUrlData {
  url: string;
  expiresIn: number;
  expiresAt: string;
}

interface AttachmentAccessState {
  status: AttachmentAccessStatus;
  signedUrl?: string;
  expiresAt?: string;
  errorMessage?: string;
}

const IMAGE_EXTENSIONS = /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)$/i;
const VIDEO_EXTENSIONS = /\.(m4v|mov|mp4|mpeg|ogg|ogv|webm)$/i;
const ACCESS_URL_EXPIRY_BUFFER_MS = 30 * 1000;

function getAttachmentKind(attachment: RequestAttachment): AttachmentKind {
  const normalizedType = attachment.fileType?.toLowerCase() ?? "";
  const fileTarget = `${attachment.fileName} ${attachment.fileUrl}`;

  if (normalizedType.startsWith("image/") || IMAGE_EXTENSIONS.test(fileTarget)) {
    return "image";
  }

  if (normalizedType.startsWith("video/") || VIDEO_EXTENSIONS.test(fileTarget)) {
    return "video";
  }

  return "file";
}

function formatFileSize(sizeInBytes: number): string {
  if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0) {
    return "0 KB";
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getAttachmentKey(attachment: RequestAttachment): string {
  return attachment.id || attachment.fileUrl;
}

function isAccessStateExpired(state?: AttachmentAccessState): boolean {
  if (!state?.signedUrl || !state.expiresAt) {
    return true;
  }

  const expiresAtTime = Date.parse(state.expiresAt);
  if (Number.isNaN(expiresAtTime)) {
    return true;
  }

  return expiresAtTime - Date.now() <= ACCESS_URL_EXPIRY_BUFFER_MS;
}

export function RequestAttachmentsPreview({
  attachments,
}: {
  attachments?: RequestAttachment[];
}) {
  const [selectedAttachment, setSelectedAttachment] = useState<RequestAttachment | null>(null);
  const [attachmentAccess, setAttachmentAccess] = useState<Record<string, AttachmentAccessState>>({});

  const safeAttachments = useMemo(() => attachments ?? [], [attachments]);
  const attachmentAccessRef = useRef<Record<string, AttachmentAccessState>>({});
  const inflightRequestsRef = useRef<Record<string, Promise<string | null> | undefined>>({});

  useEffect(() => {
    attachmentAccessRef.current = attachmentAccess;
  }, [attachmentAccess]);

  const resolveAttachmentAccess = useCallback(
    async (attachment: RequestAttachment, options?: { forceRefresh?: boolean }) => {
      const key = getAttachmentKey(attachment);
      const currentState = attachmentAccessRef.current[key];
      const shouldRefresh = Boolean(options?.forceRefresh) || isAccessStateExpired(currentState);

      if (!shouldRefresh && currentState?.status === "ready" && currentState.signedUrl) {
        return currentState.signedUrl;
      }

      if (inflightRequestsRef.current[key]) {
        return inflightRequestsRef.current[key];
      }

      setAttachmentAccess((prev) => ({
        ...prev,
        [key]: {
          status: "loading",
          signedUrl: prev[key]?.signedUrl,
          expiresAt: prev[key]?.expiresAt,
        },
      }));

      const requestPromise = (async () => {
        try {
          const response = await apiPost<ApiEnvelope<AttachmentAccessUrlData>>(
            "/api/v1/requests/attachments/access-url",
            { fileUrl: attachment.fileUrl },
            { auth: true }
          );
          const payload = unwrapData(response);
          const nextState: AttachmentAccessState = {
            status: "ready",
            signedUrl: payload.url,
            expiresAt: payload.expiresAt,
          };

          setAttachmentAccess((prev) => ({
            ...prev,
            [key]: nextState,
          }));

          return payload.url;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Não foi possível liberar o acesso temporário ao anexo.";

          setAttachmentAccess((prev) => ({
            ...prev,
            [key]: {
              status: "error",
              errorMessage,
            },
          }));

          return null;
        } finally {
          delete inflightRequestsRef.current[key];
        }
      })();

      inflightRequestsRef.current[key] = requestPromise;
      return requestPromise;
    },
    []
  );

  const handlePreviewOpen = useCallback(
    (attachment: RequestAttachment) => {
      setSelectedAttachment(attachment);
      void resolveAttachmentAccess(attachment);
    },
    [resolveAttachmentAccess]
  );

  const handleOpenAttachment = useCallback(
    async (attachment: RequestAttachment) => {
      const signedUrl = await resolveAttachmentAccess(attachment);
      if (!signedUrl) return;

      window.open(signedUrl, "_blank", "noopener,noreferrer");
    },
    [resolveAttachmentAccess]
  );

  const handleDownloadAttachment = useCallback(
    async (attachment: RequestAttachment) => {
      const signedUrl = await resolveAttachmentAccess(attachment);
      if (!signedUrl) return;

      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = attachment.fileName;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    [resolveAttachmentAccess]
  );

  useEffect(() => {
    if (!selectedAttachment) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedAttachment(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedAttachment]);

  useEffect(() => {
    const previewableAttachments = safeAttachments.filter(
      (attachment) => getAttachmentKind(attachment) !== "file"
    );

    previewableAttachments.forEach((attachment) => {
      const currentState = attachmentAccessRef.current[getAttachmentKey(attachment)];
      if (currentState?.status === "loading") {
        return;
      }

      if (currentState?.status === "ready" && !isAccessStateExpired(currentState)) {
        return;
      }

      void resolveAttachmentAccess(attachment);
    });
  }, [resolveAttachmentAccess, safeAttachments]);

  useEffect(() => {
    if (!selectedAttachment) {
      return;
    }

    void resolveAttachmentAccess(selectedAttachment);
  }, [resolveAttachmentAccess, selectedAttachment]);

  if (safeAttachments.length === 0) {
    return null;
  }

  const selectedKind = selectedAttachment ? getAttachmentKind(selectedAttachment) : null;
  const selectedAttachmentState = selectedAttachment
    ? attachmentAccess[getAttachmentKey(selectedAttachment)]
    : undefined;
  const selectedAttachmentUrl =
    selectedAttachmentState?.status === "ready" ? selectedAttachmentState.signedUrl : undefined;
  const selectedAttachmentError = selectedAttachmentState?.status === "error";
  const isSelectedPreviewLoading =
    Boolean(selectedAttachment) &&
    selectedKind !== "file" &&
    !selectedAttachmentError &&
    !selectedAttachmentUrl;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Paperclip size={20} />
          Anexos ({safeAttachments.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeAttachments.map((attachment) => {
            const attachmentKey = getAttachmentKey(attachment);
            const kind = getAttachmentKind(attachment);
            const canPreview = kind !== "file";
            const accessState = attachmentAccess[attachmentKey];
            const previewUrl = accessState?.status === "ready" ? accessState.signedUrl : undefined;
            const previewUnavailable = accessState?.status === "error";
            const isPreparingPreview =
              accessState?.status === "loading" || (!accessState && canPreview);
            const actionsDisabled = accessState?.status === "error";

            return (
              <div
                key={attachment.id}
                className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden"
              >
                {canPreview ? (
                  <button
                    type="button"
                    onClick={() => handlePreviewOpen(attachment)}
                    disabled={previewUnavailable}
                    className="group relative block w-full bg-slate-900 aspect-video overflow-hidden text-left disabled:cursor-not-allowed"
                  >
                    {previewUrl ? (
                      kind === "image" ? (
                        // Signed attachment URLs are generated dynamically, so a plain img keeps the preview flexible.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt={attachment.fileName}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <video
                          src={previewUrl}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                          {isPreparingPreview ? (
                            <>
                              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                              <p className="text-sm font-medium text-white/85">
                                Preparando preview...
                              </p>
                            </>
                          ) : (
                            <>
                              {kind === "image" ? <ImageIcon size={28} /> : <PlayCircle size={28} />}
                              <p className="text-sm font-medium text-white/85">
                                Preview indisponível
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3 text-white">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {kind === "image" ? <ImageIcon size={16} /> : <PlayCircle size={16} />}
                        {previewUnavailable
                          ? "Preview indisponível"
                          : kind === "image"
                            ? "Visualizar imagem"
                            : "Visualizar vídeo"}
                      </div>
                      <span className="text-xs text-white/80">
                        {previewUnavailable ? "Acesso interno indisponível" : "Clique para ampliar"}
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <FileText size={30} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">Arquivo sem preview</p>
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 break-all">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {attachment.fileType || "Arquivo"} • {formatFileSize(attachment.fileSize)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {canPreview && (
                      <button
                        type="button"
                        onClick={() => handlePreviewOpen(attachment)}
                        disabled={previewUnavailable}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {kind === "image" ? <ImageIcon size={14} /> : <PlayCircle size={14} />}
                        Visualizar
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => void handleDownloadAttachment(attachment)}
                      disabled={actionsDisabled}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download size={14} />
                      {accessState?.status === "loading" && !previewUrl ? "Preparando..." : "Baixar"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleOpenAttachment(attachment)}
                      disabled={actionsDisabled}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ExternalLink size={14} />
                      Abrir
                    </button>
                  </div>

                  {previewUnavailable && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      Não foi possível liberar o acesso temporário a este anexo.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedAttachment && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setSelectedAttachment(null)}
          role="presentation"
        >
          <div
            className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Preview do anexo ${selectedAttachment.fileName}`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
              <div className="min-w-0">
                <p className="text-base font-semibold text-gray-900 break-all">
                  {selectedAttachment.fileName}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedAttachment.fileType || "Arquivo"} • {formatFileSize(selectedAttachment.fileSize)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void handleDownloadAttachment(selectedAttachment)}
                  disabled={selectedAttachmentError}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} />
                  Baixar
                </button>
                <button
                  type="button"
                  onClick={() => void handleOpenAttachment(selectedAttachment)}
                  disabled={selectedAttachmentError}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ExternalLink size={14} />
                  Abrir
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAttachment(null)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Fechar preview"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 p-4 sm:p-6 flex items-center justify-center overflow-auto">
              {isSelectedPreviewLoading && (
                <div className="text-center text-white">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                  <p className="mt-4 text-sm text-white/80">Preparando preview seguro...</p>
                </div>
              )}

              {selectedAttachmentError && (
                <div className="text-center text-white">
                  <FileText size={40} className="mx-auto mb-4 text-white/70" />
                  <p className="text-lg font-medium">Não foi possível carregar o preview.</p>
                  <p className="text-sm text-white/70 mt-2">
                    O anexo continua vinculado à solicitação, mas o acesso temporário não pôde ser liberado agora.
                  </p>
                </div>
              )}

              {selectedKind === "image" && selectedAttachmentUrl && !selectedAttachmentError && (
                // Expanded previews use the signed URL resolved for this attachment.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedAttachmentUrl}
                  alt={selectedAttachment.fileName}
                  className="max-h-full w-auto rounded-2xl object-contain"
                />
              )}

              {selectedKind === "video" && selectedAttachmentUrl && !selectedAttachmentError && (
                <video
                  src={selectedAttachmentUrl}
                  controls
                  playsInline
                  className="max-h-full w-full rounded-2xl bg-black"
                />
              )}

              {selectedKind === "file" && !selectedAttachmentError && (
                <div className="text-center text-white">
                  <FileText size={40} className="mx-auto mb-4 text-white/70" />
                  <p className="text-lg font-medium">Esse arquivo não possui preview embutido.</p>
                  <p className="text-sm text-white/70 mt-2">
                    Use os botões acima para abrir ou baixar o anexo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
