import { createContext, useContext, useState, type ReactNode } from "react";

import astronaut from "@/assets/avatars/astronaut.png";
import explorer from "@/assets/avatars/explorer.png";
import pirate from "@/assets/avatars/pirate.png";
import scientist from "@/assets/avatars/scientist.png";
import adventurer from "@/assets/avatars/adventurer.png";
import samurai from "@/assets/avatars/samurai.png";
import wizard from "@/assets/avatars/wizard.png";
import superhero from "@/assets/avatars/superhero.png";

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

type GameId = "memoria" | "bandeiras" | "safari" | "sons" | "monumentos" | "seteerros";

type PassportState = {
  explorerName: string;
  setExplorerName: (name: string) => void;
  avatar: string; // image URL
  setAvatar: (a: string) => void;
  isLoggedIn: boolean;
  login: (name: string, avatar: string) => void;
  logout: () => void;
  stamps: Stamp[];
  addStamp: (country: CountrySlug) => void;
  hasStamp: (country: CountrySlug) => boolean;
  storyRead: Record<CountrySlug, boolean>;
  gamesDone: Record<CountrySlug, boolean>;
  markStoryRead: (country: CountrySlug) => void;
  markGamesDone: (country: CountrySlug) => void;
  miniGameScores: Record<GameId, number>;
  setMiniGameScore: (id: GameId, score: number) => void;
  resetPassport: () => void;
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
  const [explorerName, setExplorerName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [storyRead, setStoryRead] = useState<Record<CountrySlug, boolean>>({ ...emptyProgress });
  const [gamesDone, setGamesDone] = useState<Record<CountrySlug, boolean>>({ ...emptyProgress });
  const [miniGameScores, setMiniGameScores] =
    useState<Record<GameId, number>>({ ...emptyMiniGames });

  const isLoggedIn = explorerName.trim().length > 0 && avatar.length > 0;

  const login = (name: string, av: string) => {
    setExplorerName(name.trim());
    setAvatar(av);
  };

  const addStamp = (country: CountrySlug) => {
    setStamps((prev) =>
      prev.find((s) => s.country === country)
        ? prev
        : [...prev, { country, date: new Date().toLocaleDateString("pt-BR") }],
    );
  };

  const hasStamp = (country: CountrySlug) => stamps.some((s) => s.country === country);

  const markStoryRead = (country: CountrySlug) =>
    setStoryRead((prev) => ({ ...prev, [country]: true }));
  const markGamesDone = (country: CountrySlug) =>
    setGamesDone((prev) => ({ ...prev, [country]: true }));

  const setMiniGameScore = (id: GameId, score: number) =>
    setMiniGameScores((prev) => ({ ...prev, [id]: Math.max(prev[id], score) }));

  const resetPassport = () => {
    setStamps([]);
    setStoryRead({ ...emptyProgress });
    setGamesDone({ ...emptyProgress });
    setMiniGameScores({ ...emptyMiniGames });
    setExplorerName("");
    setAvatar("");
  };

  const logout = () => resetPassport();

  return (
    <PassportContext.Provider
      value={{
        explorerName,
        setExplorerName,
        avatar,
        setAvatar,
        isLoggedIn,
        login,
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
