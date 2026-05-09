import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { attachSupabaseToken } from "./auth-token-middleware";

/**
 * Deletes the currently authenticated user's account. Cascading FKs and
 * RLS-owned rows (profiles, stamps, country_progress, mini_game_scores)
 * are removed via `auth.users` deletion + cleanup below.
 */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([attachSupabaseToken, requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;

    // Best-effort cleanup of user-owned rows (in case FKs are not cascading).
    await Promise.all([
      supabaseAdmin.from("stamps").delete().eq("user_id", userId),
      supabaseAdmin.from("country_progress").delete().eq("user_id", userId),
      supabaseAdmin.from("mini_game_scores").delete().eq("user_id", userId),
      supabaseAdmin.from("profiles").delete().eq("id", userId),
    ]);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      throw new Response(error.message, { status: 500 });
    }
    return { ok: true };
  });
