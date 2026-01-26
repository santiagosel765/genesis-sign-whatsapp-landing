"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildChromeIntentUrl,
  buildTargetUrl,
  isAndroidUserAgent,
  isIOSUserAgent,
  isValidId,
  isWhatsAppInApp,
  sanitizeId
} from "@/utils/ua";

interface PageProps {
  params: { id: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "";

export default function WhatsappRedirectPage({ params }: PageProps) {
  const cleanId = useMemo(() => sanitizeId(params.id), [params.id]);
  const isIdValid = useMemo(() => isValidId(cleanId), [cleanId]);
  const targetUrl = useMemo(() => {
    if (!BASE_URL || !isIdValid) {
      return "";
    }
    return buildTargetUrl(BASE_URL, cleanId);
  }, [cleanId, isIdValid]);

  const [shouldRenderLanding, setShouldRenderLanding] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  useEffect(() => {
    if (!targetUrl) {
      return;
    }

    const ua = navigator.userAgent;
    const isIOS = isIOSUserAgent(ua);
    const isAndroid = isAndroidUserAgent(ua);
    const isWhatsapp = isWhatsAppInApp(ua);

    if (isIOS || (isAndroid && !isWhatsapp)) {
      window.location.replace(targetUrl);
      return;
    }

    if (isAndroid && isWhatsapp) {
      setShouldRenderLanding(true);
    }
  }, [targetUrl]);

  const handleOpenBrowser = () => {
    if (!targetUrl) {
      return;
    }

    const intentUrl = buildChromeIntentUrl(targetUrl);
    window.location.href = intentUrl;

    window.setTimeout(() => {
      window.location.href = targetUrl;
    }, 800);
  };

  const handleCopy = async () => {
    if (!targetUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (error) {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  if (!BASE_URL || !isIdValid) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="text-xl font-semibold text-slate-900">
            Link inválido
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            El enlace no es válido o falta el identificador del documento.
          </p>
          <a
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            href={BASE_URL || "https://innova.genesisempresarial.com/sign"}
          >
            Ir al sistema principal
          </a>
        </div>
      </main>
    );
  }

  if (!shouldRenderLanding) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
            ↪
          </div>
          <h1 className="mt-4 text-lg font-semibold text-slate-900">
            Redirigiendo...
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Estamos abriendo el documento de firma.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          WhatsApp detectado
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Abre el documento en tu navegador
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Para continuar con la firma necesitas abrir este enlace fuera de
          WhatsApp.
        </p>

        <button
          className="mt-6 w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          onClick={handleOpenBrowser}
          type="button"
        >
          Abrir en navegador
        </button>

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

        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          En WhatsApp toca <span className="font-semibold">⋮ → Abrir en navegador</span>
          .
        </div>
      </div>
    </main>
  );
}
