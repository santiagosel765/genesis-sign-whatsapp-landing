import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  buildTargetUrl,
  getUserAgentContext,
  isValidId,
  sanitizeId
} from "@/utils/ua";

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "";

const applyNoStoreHeaders = (response: NextResponse): NextResponse => {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/w/")) {
    return NextResponse.next();
  }

  const rawId = pathname.slice("/w/".length).split("/")[0] ?? "";
  const cleanId = sanitizeId(rawId);
  const isIdValid = isValidId(cleanId);

  if (!BASE_URL || !isIdValid) {
    return applyNoStoreHeaders(NextResponse.next());
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const uaContext = getUserAgentContext(userAgent);

  if (!uaContext.isAndroidWhatsAppWebView) {
    const targetUrl = buildTargetUrl(BASE_URL, cleanId);
    return applyNoStoreHeaders(NextResponse.redirect(targetUrl, 307));
  }

  return applyNoStoreHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/w/:id*"]
};
