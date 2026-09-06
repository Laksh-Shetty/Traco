import arcjet, {
  detectBot,
  shield,
} from "@arcjet/next";

import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/secure(.*)",
  "/dashboard(.*)",
  "/transaction(.*)",
  "/account(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY,

  rules: [
    shield({
      mode: "LIVE",
    }),

    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP",
      ],
    }),
  ],
});

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      return new Response("Forbidden", {
        status: 403,
      });
    }

    if (isProtectedRoute(req) && !userId) {
      return redirectToSignIn();
    }
  },
  {
    frontendApiProxy: {
      enabled: true,
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    "/(api|trpc)(.*)",

    "/__clerk/(.*)",
  ],
};