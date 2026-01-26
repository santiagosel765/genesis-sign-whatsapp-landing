export const isAndroidUserAgent = (ua: string): boolean => /Android/i.test(ua);

export const isIOSUserAgent = (ua: string): boolean =>
  /(iPhone|iPad|iPod)/i.test(ua);

export const isWhatsAppInApp = (ua: string): boolean =>
  isAndroidUserAgent(ua) && /(WhatsApp|wv|Version\/4\.0)/i.test(ua);

export const sanitizeId = (id: string): string =>
  id.split(/[?#]/)[0].trim();

export const isValidId = (id: string): boolean => /^\d+$/.test(id);

export const buildTargetUrl = (baseUrl: string, id: string): string => {
  const trimmedBase = baseUrl.replace(/\/$/, "");
  return `${trimmedBase}/documento/${id}`;
};

export const buildChromeIntentUrl = (targetUrl: string): string => {
  const parsed = new URL(targetUrl);
  const hostAndPath = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  return `intent://${hostAndPath}#Intent;scheme=${parsed.protocol.replace(":", "")};package=com.android.chrome;end`;
};
