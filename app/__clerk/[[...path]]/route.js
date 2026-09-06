const getFrontendApiUrl = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not configured");
  }

  const encodedFrontendApi = publishableKey.split("_").slice(2).join("_");
  const frontendApi = Buffer.from(encodedFrontendApi, "base64")
    .toString("utf8")
    .replace(/\$$/, "");

  if (!frontendApi) {
    throw new Error("Unable to determine the Clerk Frontend API");
  }

  return `https://${frontendApi}`;
};

const proxyRequest = async (request, { params }) => {
  const { path = [] } = await params;
  const targetUrl = new URL(`${getFrontendApiUrl()}/${path.join("/")}`);
  targetUrl.search = new URL(request.url).search;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await request.arrayBuffer();

  return fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;

export const runtime = "nodejs";
