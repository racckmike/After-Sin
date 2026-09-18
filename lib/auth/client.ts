"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/** Client-side Neon Auth instance — reads NEXT_PUBLIC_NEON_AUTH_URL automatically. */
export const authClient = createAuthClient();
