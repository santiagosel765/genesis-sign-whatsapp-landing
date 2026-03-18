export type UserAgentContext = {
  isAndroid: boolean;
  isIOS: boolean;
  isWhatsApp: boolean;
  isWebView: boolean;
  isAndroidWhatsAppWebView: boolean;
  isOtherInAppBrowser: boolean;
};

export const isAndroidUserAgent = (ua: string): boolean => /Android/i.test(ua);

export const isIOSUserAgent = (ua: string): boolean =>
  /(iPhone|iPad|iPod)/i.test(ua);

export const isWhatsAppUserAgent = (ua: string): boolean => /WhatsApp/i.test(ua);

export const isWebViewUserAgent = (ua: string): boolean =>
  /\bwv\b|; wv\)|Version\/4\.0|WebView/i.test(ua);

export const isAndroidWhatsAppWebViewUserAgent = (ua: string): boolean =>
  isAndroidUserAgent(ua) &&
  isWhatsAppUserAgent(ua) &&
  isWebViewUserAgent(ua);

export const isOtherInAppBrowserUserAgent = (ua: string): boolean =>
  /(FBAN|FBAV|Instagram|Line\/|Telegram|Twitter|TikTok|Snapchat)/i.test(ua);

export const getUserAgentContext = (ua: string): UserAgentContext => {
  const isAndroid = isAndroidUserAgent(ua);
  const isIOS = isIOSUserAgent(ua);
  const isWhatsApp = isWhatsAppUserAgent(ua);
  const isWebView = isWebViewUserAgent(ua);

  return {
    isAndroid,
    isIOS,
    isWhatsApp,
    isWebView,
    isAndroidWhatsAppWebView: isAndroid && isWhatsApp && isWebView,
    isOtherInAppBrowser: isOtherInAppBrowserUserAgent(ua)
  };
};

export const sanitizeId = (id: string): string =>
  id.split(/[?#]/)[0].trim();

export const isValidId = (id: string): boolean => /^\d+$/.test(id);

export const buildTargetUrl = (baseUrl: string, id: string): string => {
  const trimmedBase = baseUrl.replace(/\/$/, "");
  return `${trimmedBase}/w/${id}`;
};

export const buildChromeIntentUrl = (targetUrl: string): string => {
  const parsed = new URL(targetUrl);
  const hostAndPath = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  return `intent://${hostAndPath}#Intent;scheme=${parsed.protocol.replace(":", "")};package=com.android.chrome;end`;
};

export const buildGenericAndroidIntentUrl = (targetUrl: string): string => {
  const parsed = new URL(targetUrl);
  const hostAndPath = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  return `intent://${hostAndPath}#Intent;scheme=${parsed.protocol.replace(":", "")};action=android.intent.action.VIEW;end`;
};
