"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildChromeIntentUrl,
  buildGenericAndroidIntentUrl
} from "@/utils/ua";

interface WhatsappLandingClientProps {
  targetUrl: string;
}

export default function WhatsappLandingClient({
  targetUrl
}: WhatsappLandingClientProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const [showManualActions, setShowManualActions] = useState(false);

  const chromeIntentUrl = useMemo(
    () => buildChromeIntentUrl(targetUrl),
    [targetUrl]
  );
  const genericIntentUrl = useMemo(
    () => buildGenericAndroidIntentUrl(targetUrl),
    [targetUrl]
  );

  const tryOpenExternalBrowser = (intentUrl: string) => {
    window.location.href = intentUrl;
  };

  useEffect(() => {
    tryOpenExternalBrowser(chromeIntentUrl);

    const genericIntentTimer = window.setTimeout(() => {
      tryOpenExternalBrowser(genericIntentUrl);
    }, 900);

    const fallbackToHttpsTimer = window.setTimeout(() => {
      window.location.href = targetUrl;
    }, 1800);

    const showManualActionsTimer = window.setTimeout(() => {
      setShowManualActions(true);
    }, 4000);

    return () => {
      window.clearTimeout(genericIntentTimer);
      window.clearTimeout(fallbackToHttpsTimer);
      window.clearTimeout(showManualActionsTimer);
    };
  }, [chromeIntentUrl, genericIntentUrl, targetUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          WhatsApp Android detectado
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Estamos abriendo tu navegador
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Para firmar debes abrir el documento fuera del WebView de WhatsApp.
        </p>

        {!showManualActions ? (
          <p className="mt-6 text-sm text-slate-600">Intentando abrir automáticamente...</p>
        ) : (
          <>
            <a
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
              href={targetUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Abrir documento
            </a>

            <button
              className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={handleCopy}
              type="button"
            >
              {copyStatus === "copied"
                ? "Link copiado"
                : copyStatus === "error"
                  ? "No se pudo copiar"
                  : "Copiar link"}
            </button>
          </>
        )}

        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          Si no abre automáticamente, en WhatsApp toca
          <span className="font-semibold"> ⋮ → Abrir en navegador</span>.
        </div>
      </div>
    </main>
  );
}
