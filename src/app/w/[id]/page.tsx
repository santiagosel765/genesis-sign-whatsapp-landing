import { headers } from "next/headers";
import WhatsappLandingClient from "./WhatsappLandingClient";
import {
  buildTargetUrl,
  getUserAgentContext,
  isValidId,
  sanitizeId
} from "@/utils/ua";

interface PageProps {
  params: { id: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WhatsappRedirectPage({ params }: PageProps) {
  const cleanId = sanitizeId(params.id);
  const isIdValid = isValidId(cleanId);

  if (!BASE_URL || !isIdValid) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="text-xl font-semibold text-slate-900">Link inválido</h1>
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

  const targetUrl = buildTargetUrl(BASE_URL, cleanId);
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "";
  const uaContext = getUserAgentContext(userAgent);

  if (uaContext.isAndroidWhatsAppWebView) {
    return <WhatsappLandingClient targetUrl={targetUrl} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-slate-900">Redirigiendo…</h1>
        <p className="mt-2 text-sm text-slate-600">
          Si no te redirigimos automáticamente, usa el botón para continuar.
        </p>
        <a
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          href={targetUrl}
          rel="noopener noreferrer"
        >
          Continuar
        </a>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(targetUrl)});`
        }}
      />
    </main>
  );
}
