import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

import astronaut from "@/assets/avatars/astronaut.png";
import explorer from "@/assets/avatars/explorer.png";
import pirate from "@/assets/avatars/pirate.png";
import scientist from "@/assets/avatars/scientist.png";
import adventurer from "@/assets/avatars/adventurer.png";
import samurai from "@/assets/avatars/samurai.png";
import wizard from "@/assets/avatars/wizard.png";
import superhero from "@/assets/avatars/superhero.png";
import defaultAvatar from "@/assets/avatars/default.png";

export const DEFAULT_AVATAR_ID = "default";

const AVATAR_SRC_BY_ID: Record<string, string> = {
  default: defaultAvatar,
  astronaut,
  explorer,
  pirate,
  scientist,
  adventurer,
  samurai,
  wizard,
  superhero,
};

/** Resolve a stored avatar id (or legacy src URL) to a usable image src. */
export function getAvatarSrc(value: string | null | undefined): string {
  if (!value) return defaultAvatar;
  if (AVATAR_SRC_BY_ID[value]) return AVATAR_SRC_BY_ID[value];
  // Legacy: an actual URL (e.g. old builds saved bundled asset paths). Use as-is.
  if (value.startsWith("http") || value.startsWith("/") || value.startsWith("data:")) {
    return value;
  }
  return defaultAvatar;
}

export type CountrySlug =
  | "brasil"
  | "eua"
  | "china"
  | "russia"
  | "japao"
  | "africadosul"
  | "franca"
  | "italia"
  | "australia"
  | "mexico"
  | "argentina"
  | "canada"
  | "reinounido"
  | "alemanha"
  | "espanha"
  | "egito"
  | "india"
  | "coreiadosul"
  | "grecia"
  | "portugal";

export type AvatarOption = { id: string; src: string; label: string };

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "astronaut", src: astronaut, label: "Astronauta" },
  { id: "explorer", src: explorer, label: "Explorador" },
  { id: "pirate", src: pirate, label: "Pirata" },
  { id: "scientist", src: scientist, label: "Cientista" },
  { id: "adventurer", src: adventurer, label: "Aventureira" },
  { id: "samurai", src: samurai, label: "Samurai" },
  { id: "wizard", src: wizard, label: "Mago" },
  { id: "superhero", src: superhero, label: "Super-herói" },
];

type Stamp = {
  country: CountrySlug;
  date: string;
};

export type GameId = "memoria" | "bandeiras" | "safari" | "sons" | "monumentos" | "seteerros";

type PassportState = {
  loading: boolean;
  profileLoading: boolean;
  session: Session | null;
  explorerName: string;
  setExplorerName: (name: string) => void;
  avatar: string;
  setAvatar: (a: string) => void;
  setProfile: (name: string, avatar: string) => Promise<void>;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  stamps: Stamp[];
  addStamp: (country: CountrySlug) => void;
  hasStamp: (country: CountrySlug) => boolean;
  storyRead: Record<CountrySlug, boolean>;
  gamesDone: Record<CountrySlug, boolean>;
  markStoryRead: (country: CountrySlug) => void;
  markGamesDone: (country: CountrySlug) => void;
  miniGameScores: Record<GameId, number>;
  setMiniGameScore: (id: GameId, score: number) => void;
  resetPassport: () => Promise<void>;
};

const PassportContext = createContext<PassportState | null>(null);

const emptyProgress: Record<CountrySlug, boolean> = {
  brasil: false,
  eua: false,
  china: false,
  russia: false,
  japao: false,
  africadosul: false,
  franca: false,
  italia: false,
  australia: false,
  mexico: false,
  argentina: false,
  canada: false,
  reinounido: false,
  alemanha: false,
  espanha: false,
  egito: false,
  india: false,
  coreiadosul: false,
  grecia: false,
  portugal: false,
};

const emptyMiniGames: Record<GameId, number> = {
  memoria: 0,
  bandeiras: 0,
  safari: 0,
  sons: 0,
  monumentos: 0,
  seteerros: 0,
};

export function PassportProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const [explorerName, setExplorerNameState] = useState<string>("");
  const [avatar, setAvatarState] = useState<string>("");
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [storyRead, setStoryRead] = useState<Record<CountrySlug, boolean>>({ ...emptyProgress });
  const [gamesDone, setGamesDone] = useState<Record<CountrySlug, boolean>>({ ...emptyProgress });
  const [miniGameScores, setMiniGameScores] =
    useState<Record<GameId, number>>({ ...emptyMiniGames });

  const userIdRef = useRef<string | null>(null);

  // Auth bootstrap
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      userIdRef.current = s?.user.id ?? null;
      if (!s) {
        setExplorerNameState("");
        setAvatarState("");
        setStamps([]);
        setStoryRead({ ...emptyProgress });
        setGamesDone({ ...emptyProgress });
        setMiniGameScores({ ...emptyMiniGames });
        setProfileLoading(false);
      } else {
        setProfileLoading(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      userIdRef.current = data.session?.user.id ?? null;
      if (!data.session) setProfileLoading(false);
      setLoading(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Load data when session changes
  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) return;

    let cancelled = false;
    (async () => {
      const [profileRes, stampsRes, progressRes, scoresRes] = await Promise.all([
        supabase.from("profiles").select("explorer_name, avatar").eq("id", userId).maybeSingle(),
        supabase.from("stamps").select("country, earned_at").eq("user_id", userId),
        supabase
          .from("country_progress")
          .select("country, story_read, games_done")
          .eq("user_id", userId),
        supabase.from("mini_game_scores").select("game_id, score").eq("user_id", userId),
      ]);

      if (cancelled) return;

      if (profileRes.data) {
        setExplorerNameState(profileRes.data.explorer_name ?? "");
        setAvatarState(profileRes.data.avatar ?? "");
      }
      if (stampsRes.data) {
        setStamps(
          stampsRes.data.map((s) => ({
            country: s.country as CountrySlug,
            date: new Date(s.earned_at).toLocaleDateString("pt-BR"),
          })),
        );
      }
      if (progressRes.data) {
        const sr = { ...emptyProgress };
        const gd = { ...emptyProgress };
        for (const row of progressRes.data) {
          const c = row.country as CountrySlug;
          if (c in sr) {
            sr[c] = !!row.story_read;
            gd[c] = !!row.games_done;
          }
        }
        setStoryRead(sr);
        setGamesDone(gd);
      }
      if (scoresRes.data) {
        const next = { ...emptyMiniGames };
        for (const row of scoresRes.data) {
          const g = row.game_id as GameId;
          if (g in next) next[g] = row.score ?? 0;
        }
        setMiniGameScores(next);
      }
      setProfileLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const isLoggedIn = !!session && explorerName.trim().length > 0;

  const setExplorerName = (name: string) => {
    setExplorerNameState(name);
    const userId = userIdRef.current;
    if (!userId) return;
    // Send both fields so an upsert never wipes the other column to its default.
    void supabase
      .from("profiles")
      .upsert({ id: userId, explorer_name: name, avatar })
      .then(({ error }) => {
        if (error) console.error("[passport] setExplorerName failed", error);
      });
  };

  const setAvatar = (a: string) => {
    setAvatarState(a);
    const userId = userIdRef.current;
    if (!userId) return;
    void supabase
      .from("profiles")
      .upsert({ id: userId, explorer_name: explorerName, avatar: a })
      .then(({ error }) => {
        if (error) console.error("[passport] setAvatar failed", error);
      });
  };

  const setProfile = async (name: string, a: string) => {
    setExplorerNameState(name);
    setAvatarState(a);
    const userId = userIdRef.current;
    if (!userId) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, explorer_name: name, avatar: a });
    if (error) console.error("[passport] setProfile failed", error);
  };

  const addStamp = (country: CountrySlug) => {
    setStamps((prev) =>
      prev.find((s) => s.country === country)
        ? prev
        : [...prev, { country, date: new Date().toLocaleDateString("pt-BR") }],
    );
    const userId = userIdRef.current;
    if (!userId) return;
    void supabase
      .from("stamps")
      .upsert({ user_id: userId, country }, { onConflict: "user_id,country" })
      .then(({ error }) => {
        if (error) console.error("[passport] addStamp failed", error);
      });
  };

  const hasStamp = (country: CountrySlug) => stamps.some((s) => s.country === country);

  const upsertProgress = (country: CountrySlug, patch: { story_read?: boolean; games_done?: boolean }) => {
    const userId = userIdRef.current;
    if (!userId) return;
    void supabase
      .from("country_progress")
      .upsert(
        {
          user_id: userId,
          country,
          story_read: patch.story_read ?? storyRead[country] ?? false,
          games_done: patch.games_done ?? gamesDone[country] ?? false,
        },
        { onConflict: "user_id,country" },
      )
      .then(({ error }) => {
        if (error) console.error("[passport] upsertProgress failed", error);
      });
  };

  const markStoryRead = (country: CountrySlug) => {
    setStoryRead((prev) => ({ ...prev, [country]: true }));
    upsertProgress(country, { story_read: true });
  };

  const markGamesDone = (country: CountrySlug) => {
    setGamesDone((prev) => ({ ...prev, [country]: true }));
    upsertProgress(country, { games_done: true });
  };

  const setMiniGameScore = (id: GameId, score: number) => {
    setMiniGameScores((prev) => {
      const best = Math.max(prev[id], score);
      if (best !== prev[id]) {
        const userId = userIdRef.current;
        if (userId) {
          void supabase
            .from("mini_game_scores")
            .upsert(
              { user_id: userId, game_id: id, score: best },
              { onConflict: "user_id,game_id" },
            )
            .then(({ error }) => {
              if (error) console.error("[passport] setMiniGameScore failed", error);
            });
        }
      }
      return { ...prev, [id]: best };
    });
  };

  const resetPassport = async () => {
    const userId = userIdRef.current;
    setStamps([]);
    setStoryRead({ ...emptyProgress });
    setGamesDone({ ...emptyProgress });
    setMiniGameScores({ ...emptyMiniGames });
    if (userId) {
      await Promise.all([
        supabase.from("stamps").delete().eq("user_id", userId),
        supabase.from("country_progress").delete().eq("user_id", userId),
        supabase
          .from("mini_game_scores")
          .update({ score: 0 })
          .eq("user_id", userId),
      ]);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <PassportContext.Provider
      value={{
        loading,
        session,
        explorerName,
        setExplorerName,
        avatar,
        setAvatar,
        setProfile,
        isLoggedIn,
        logout,
        stamps,
        addStamp,
        hasStamp,
        storyRead,
        gamesDone,
        markStoryRead,
        markGamesDone,
        miniGameScores,
        setMiniGameScore,
        resetPassport,
      }}
    >
      {children}
    </PassportContext.Provider>
  );
}

export function usePassport() {
  const ctx = useContext(PassportContext);
  if (!ctx) throw new Error("usePassport must be used within PassportProvider");
  return ctx;
}
