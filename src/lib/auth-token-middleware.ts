import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side middleware that attaches the current Supabase session's
 * access token as a Bearer Authorization header so server functions
 * protected by `requireSupabaseAuth` can authenticate the user.
 */
export const attachSupabaseToken = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
