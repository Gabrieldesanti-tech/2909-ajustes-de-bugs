// Phiz deep link utilities based on phizscheme:// spec.
// See: phizscheme_deep_link_spec_en

// Public app identifier used by the browser to open the Phiz mini-app entrypoint.
const PHIZ_APP_ID = process.env.NEXT_PUBLIC_PHIZ_APP_ID ?? "";

export const PHIZ_STORE_URLS = {
  android: "https://play.google.com/store/apps/details?id=live.phiz.app2",
  ios: "https://apps.apple.com/br/app/phiz-chat/id6447375837",
} as const;

/**
 * Builds a `phizscheme://` deep link for the mini-program entry.
 * Format: phizscheme://appId={appId}&path={path}&query={query}
 * Falls back to plain `phizscheme://` when no appId is configured.
 */
type PhizQueryValue = string | number | boolean | null | undefined;
type PhizQueryInput = string | Record<string, PhizQueryValue>;

export type PhizPlatform = "ios" | "android" | "unknown";

type OpenPhizDeepLinkOptions = {
  path?: string;
  query?: PhizQueryInput;
  platform?: Exclude<PhizPlatform, "unknown">;
  fallbackToStore?: boolean;
  fallbackDelayMs?: number;
};

function serializePhizQuery(query?: PhizQueryInput): string {
  if (!query) return "";
  if (typeof query === "string") return query;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  return params.toString();
}

export function buildPhizDeepLink(
  path = "/",
  query?: PhizQueryInput
): string {
  // Without the appId we can still attempt to open Phiz, but not a specific mini-app target.
  if (!PHIZ_APP_ID) return "phizscheme://";

  const params = new URLSearchParams();
  params.set("appId", PHIZ_APP_ID);
  params.set("path", path);

  const serializedQuery = serializePhizQuery(query);
  if (serializedQuery) {
    params.set("query", serializedQuery);
  }

  return `phizscheme://${params.toString()}`;
}

function detectPlatform(): PhizPlatform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "unknown";
}

export function openPhizStore(platform?: Exclude<PhizPlatform, "unknown">): void {
  const resolvedPlatform = platform ?? detectPlatform();
  const fallbackUrl =
    resolvedPlatform === "ios"
      ? PHIZ_STORE_URLS.ios
      : PHIZ_STORE_URLS.android;

  window.location.href = fallbackUrl;
}

/**
 * Attempts to open the Phiz app via deep link.
 * If the app is not installed (page remains visible after timeout),
 * redirects to the appropriate store.
 */
export function openPhizDeepLink(options: OpenPhizDeepLinkOptions = {}): void {
  const {
    path = "/",
    query,
    platform,
    fallbackToStore = true,
    fallbackDelayMs = 2000,
  } = options;
  const deepLink = buildPhizDeepLink(path, query);
  const fallbackPlatform = platform ?? detectPlatform();
  const start = Date.now();

  window.location.href = deepLink;

  setTimeout(() => {
    if (!fallbackToStore) {
      return;
    }

    // If the page is still visible after the timeout, the app likely did not open.
    if (document.visibilityState === "visible" && Date.now() - start < fallbackDelayMs + 2000) {
      openPhizStore(fallbackPlatform === "unknown" ? "android" : fallbackPlatform);
    }
  }, fallbackDelayMs);
}
