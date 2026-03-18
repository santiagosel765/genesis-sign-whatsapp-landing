import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

export default function WhatsappRedirectPage({ params }: PageProps) {
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
  const userAgent = headers().get("user-agent") ?? "";
  const uaContext = getUserAgentContext(userAgent);

  if (!uaContext.isAndroidWhatsAppWebView) {
    redirect(targetUrl);
  }

  return <WhatsappLandingClient targetUrl={targetUrl} />;
}
