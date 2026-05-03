import type { CountrySlug } from "@/context/PassportContext";

import panda from "@/assets/animals/panda.jpg";
import eagle from "@/assets/animals/eagle.jpg";
import macaw from "@/assets/animals/macaw.jpg";
import brownBear from "@/assets/animals/brown-bear.jpg";
import redFox from "@/assets/animals/red-fox.jpg";
import caiman from "@/assets/animals/caiman.jpg";
import lion from "@/assets/animals/lion.jpg";
import rooster from "@/assets/animals/rooster.jpg";
import wolf from "@/assets/animals/wolf.jpg";
import kangaroo from "@/assets/animals/kangaroo.jpg";
import goldenEagle from "@/assets/animals/golden-eagle.jpg";
import toucan from "@/assets/animals/toucan.jpg";
import bison from "@/assets/animals/bison.jpg";
import siberianTiger from "@/assets/animals/siberian-tiger.jpg";
import snowMonkey from "@/assets/animals/snow-monkey.jpg";
import koala from "@/assets/animals/koala.jpg";
import jaguar from "@/assets/animals/jaguar.jpg";
import elephant from "@/assets/animals/elephant.jpg";
import amurLeopard from "@/assets/animals/amur-leopard.jpg";
import capybara from "@/assets/animals/capybara.jpg";
import cheetah from "@/assets/animals/cheetah.jpg";
import chineseCrane from "@/assets/animals/chinese-crane.jpg";
import goldenMonkey from "@/assets/animals/golden-monkey.jpg";
import grizzly from "@/assets/animals/grizzly.jpg";
import ibex from "@/assets/animals/ibex.jpg";
import jaguarBr from "@/assets/animals/jaguar-br.jpg";
import japaneseCrane from "@/assets/animals/japanese-crane.jpg";
import moose from "@/assets/animals/moose.jpg";
import raccoon from "@/assets/animals/raccoon.jpg";
import redPanda from "@/assets/animals/red-panda.jpg";
import rhino from "@/assets/animals/rhino.jpg";
import saiga from "@/assets/animals/saiga.jpg";
import siberianHusky from "@/assets/animals/siberian-husky.jpg";
import sikaDeer from "@/assets/animals/sika-deer.jpg";
import southChinaTiger from "@/assets/animals/south-china-tiger.jpg";
import tanuki from "@/assets/animals/tanuki.jpg";
import iberianLynx from "@/assets/animals/iberian-lynx.jpg";
import fennecFox from "@/assets/animals/fennec-fox.jpg";
import bengalTiger from "@/assets/animals/bengal-tiger.jpg";
import peacock from "@/assets/animals/peacock.jpg";
import guanaco from "@/assets/animals/guanaco.jpg";
import redSquirrel from "@/assets/animals/red-squirrel.jpg";
import hedgehog from "@/assets/animals/hedgehog.jpg";
import koreanMagpie from "@/assets/animals/korean-magpie.jpg";
import monkSeal from "@/assets/animals/monk-seal.jpg";
import iberianWolf from "@/assets/animals/iberian-wolf.jpg";
import camel from "@/assets/animals/camel.jpg";
import asianElephant from "@/assets/animals/asian-elephant.jpg";
import condor from "@/assets/animals/condor.jpg";
import koreanTiger from "@/assets/animals/korean-tiger.jpg";
import greekTortoise from "@/assets/animals/greek-tortoise.jpg";
import beaver from "@/assets/animals/beaver.jpg";
import highlandCow from "@/assets/animals/highland-cow.jpg";
import germanEagle from "@/assets/animals/german-eagle.jpg";
import axolotl from "@/assets/animals/axolotl.jpg";
import goldenTamarin from "@/assets/animals/golden-tamarin.jpg";
import wombat from "@/assets/animals/wombat.jpg";
import chamois from "@/assets/animals/chamois.jpg";
import nileCrocodile from "@/assets/animals/nile-crocodile.jpg";
import spanishBull from "@/assets/animals/spanish-bull.jpg";
import barcelosRooster from "@/assets/animals/barcelos-rooster.jpg";

import liberty from "@/assets/monuments/liberty.jpg";
import himeji from "@/assets/monuments/himeji.jpg";
import greatWall from "@/assets/monuments/great-wall.jpg";
import stBasil from "@/assets/monuments/st-basil.jpg";
import christRedeemer from "@/assets/monuments/christ-redeemer.jpg";
import tableMountain from "@/assets/monuments/table-mountain.jpg";
import eiffel from "@/assets/monuments/eiffel.jpg";
import colosseum from "@/assets/monuments/colosseum.jpg";
import operaHouse from "@/assets/monuments/opera-house.jpg";
import chichenItza from "@/assets/monuments/chichen-itza.jpg";
import sugarloaf from "@/assets/monuments/sugarloaf.jpg";
import lencois from "@/assets/monuments/lencois.jpg";
import rushmore from "@/assets/monuments/rushmore.jpg";
import forbiddenCity from "@/assets/monuments/forbidden-city.jpg";
import mtFuji from "@/assets/monuments/mt-fuji.jpg";
import hermitage from "@/assets/monuments/hermitage.jpg";
import montStMichel from "@/assets/monuments/mont-saint-michel.jpg";
import pisa from "@/assets/monuments/pisa.jpg";
import uluru from "@/assets/monuments/uluru.jpg";
import teotihuacan from "@/assets/monuments/teotihuacan.jpg";
import capeGoodHope from "@/assets/monuments/cape-good-hope.jpg";

import olaSnd from "@/assets/sounds/ola.mp3";
import helloSnd from "@/assets/sounds/hello.mp3";
import nihaoSnd from "@/assets/sounds/nihao.mp3";
import privetSnd from "@/assets/sounds/privet.mp3";
import konnichiwaSnd from "@/assets/sounds/konnichiwa.mp3";
import bonjourSnd from "@/assets/sounds/bonjour.mp3";
import ciaoSnd from "@/assets/sounds/ciao.mp3";
import gdaySnd from "@/assets/sounds/gday.mp3";
import holaSnd from "@/assets/sounds/hola.mp3";
import sawubonaSnd from "@/assets/sounds/sawubona.mp3";

export type MiniGameId = "memoria" | "bandeiras" | "safari" | "sons" | "monumentos" | "seteerros";

export type MiniGameMeta = {
  id: MiniGameId;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
};

// Number of questions / pairs played per round (random subset)
export const ROUND_SIZE = 6;

export const MINI_GAMES: MiniGameMeta[] = [
  {
    id: "memoria",
    title: "Jogo da Memória",
    emoji: "🧠",
    tagline: "Combine pares de bandeiras",
    description: "Encontre os pares de bandeiras dos países. A cada partida, as cartas mudam!",
    color: "var(--coral)",
  },
  {
    id: "bandeiras",
    title: "Quiz das Bandeiras",
    emoji: "🏳️",
    tagline: "Adivinhe o país pela bandeira",
    description: "Descubra a qual país pertence cada bandeira colorida.",
    color: "var(--sky)",
  },
  {
    id: "safari",
    title: "Safari Fotográfico",
    emoji: "📸",
    tagline: "Encontre os animais",
    description: "Descubra de qual país é cada animal antes que ele se esconda.",
    color: "var(--mint)",
  },
  {
    id: "sons",
    title: "Sons do Mundo",
    emoji: "🎵",
    tagline: "Adivinhe o país pelo som",
    description: "Ouça uma palavra ou expressão e adivinhe o país de origem.",
    color: "var(--sunshine)",
  },
  {
    id: "monumentos",
    title: "Caça aos Monumentos",
    emoji: "🗿",
    tagline: "Reconheça lugares famosos",
    description: "Identifique os monumentos icônicos espalhados pelo mundo.",
    color: "var(--grape)",
  },
  {
    id: "seteerros",
    title: "Sete Erros",
    emoji: "🔍",
    tagline: "Encontre as 7 diferenças",
    description: "Compare duas cenas de um país e encontre os 7 elementos diferentes.",
    color: "var(--coral)",
  },
];

// Flag cards: ISO code drives the flag-icons CSS rendering
export const FLAG_CARDS: {
  country: CountrySlug;
  iso: string; // ISO 3166-1 alpha-2 (lowercase)
  name: string;
  flag: string; // emoji fallback
}[] = [
  { country: "brasil", iso: "br", name: "Brasil", flag: "🇧🇷" },
  { country: "eua", iso: "us", name: "Estados Unidos", flag: "🇺🇸" },
  { country: "china", iso: "cn", name: "China", flag: "🇨🇳" },
  { country: "russia", iso: "ru", name: "Rússia", flag: "🇷🇺" },
  { country: "japao", iso: "jp", name: "Japão", flag: "🇯🇵" },
  { country: "africadosul", iso: "za", name: "África do Sul", flag: "🇿🇦" },
  { country: "franca", iso: "fr", name: "França", flag: "🇫🇷" },
  { country: "italia", iso: "it", name: "Itália", flag: "🇮🇹" },
  { country: "australia", iso: "au", name: "Austrália", flag: "🇦🇺" },
  { country: "mexico", iso: "mx", name: "México", flag: "🇲🇽" },
  { country: "argentina", iso: "ar", name: "Argentina", flag: "🇦🇷" },
  { country: "canada", iso: "ca", name: "Canadá", flag: "🇨🇦" },
  { country: "reinounido", iso: "gb", name: "Reino Unido", flag: "🇬🇧" },
  { country: "alemanha", iso: "de", name: "Alemanha", flag: "🇩🇪" },
  { country: "espanha", iso: "es", name: "Espanha", flag: "🇪🇸" },
  { country: "egito", iso: "eg", name: "Egito", flag: "🇪🇬" },
  { country: "india", iso: "in", name: "Índia", flag: "🇮🇳" },
  { country: "coreiadosul", iso: "kr", name: "Coreia do Sul", flag: "🇰🇷" },
  { country: "grecia", iso: "gr", name: "Grécia", flag: "🇬🇷" },
  { country: "portugal", iso: "pt", name: "Portugal", flag: "🇵🇹" },
];

// Mapping from country slug to ISO code (for flag rendering on map/passport)
export const COUNTRY_ISO: Record<CountrySlug, string> = {
  brasil: "br",
  eua: "us",
  china: "cn",
  russia: "ru",
  japao: "jp",
  africadosul: "za",
  franca: "fr",
  italia: "it",
  australia: "au",
  mexico: "mx",
  argentina: "ar",
  canada: "ca",
  reinounido: "gb",
  alemanha: "de",
  espanha: "es",
  egito: "eg",
  india: "in",
  coreiadosul: "kr",
  grecia: "gr",
  portugal: "pt",
};

export const ANIMAL_QUESTIONS = [
  // Brasil
  { image: macaw, country: "Brasil", animal: "Arara" },
  { image: caiman, country: "Brasil", animal: "Jacaré" },
  { image: toucan, country: "Brasil", animal: "Tucano" },
  { image: jaguarBr, country: "Brasil", animal: "Onça-pintada" },
  { image: capybara, country: "Brasil", animal: "Capivara" },
  // EUA
  { image: eagle, country: "Estados Unidos", animal: "Águia-careca" },
  { image: bison, country: "Estados Unidos", animal: "Bisão americano" },
  { image: grizzly, country: "Estados Unidos", animal: "Urso-grizzly" },
  { image: raccoon, country: "Estados Unidos", animal: "Guaxinim" },
  // China
  { image: panda, country: "China", animal: "Panda-gigante" },
  { image: redPanda, country: "China", animal: "Panda-vermelho" },
  { image: goldenMonkey, country: "China", animal: "Macaco-dourado" },
  { image: chineseCrane, country: "China", animal: "Grou-chinês" },
  { image: southChinaTiger, country: "China", animal: "Tigre do sul da China" },
  // Rússia
  { image: brownBear, country: "Rússia", animal: "Urso-pardo" },
  { image: siberianTiger, country: "Rússia", animal: "Tigre-siberiano" },
  { image: amurLeopard, country: "Rússia", animal: "Leopardo-de-amur" },
  { image: saiga, country: "Rússia", animal: "Antílope saiga" },
  { image: siberianHusky, country: "Rússia", animal: "Husky siberiano" },
  // Japão
  { image: redFox, country: "Japão", animal: "Raposa-vermelha" },
  { image: snowMonkey, country: "Japão", animal: "Macaco da neve" },
  { image: japaneseCrane, country: "Japão", animal: "Grou-japonês" },
  { image: sikaDeer, country: "Japão", animal: "Cervo-sika" },
  { image: tanuki, country: "Japão", animal: "Tanuki" },
  // África do Sul
  { image: lion, country: "África do Sul", animal: "Leão" },
  { image: elephant, country: "África do Sul", animal: "Elefante africano" },
  { image: cheetah, country: "África do Sul", animal: "Guepardo" },
  { image: rhino, country: "África do Sul", animal: "Rinoceronte" },
  // França
  { image: rooster, country: "França", animal: "Galo gaulês" },
  { image: chamois, country: "França", animal: "Camurça-dos-alpes" },
  // Itália
  { image: wolf, country: "Itália", animal: "Lobo-cinzento" },
  { image: ibex, country: "Itália", animal: "Cabra-dos-alpes (Ibex)" },
  // Austrália
  { image: kangaroo, country: "Austrália", animal: "Canguru" },
  { image: koala, country: "Austrália", animal: "Coala" },
  { image: wombat, country: "Austrália", animal: "Vombate" },
  // México
  { image: goldenEagle, country: "México", animal: "Águia-real" },
  { image: jaguar, country: "México", animal: "Jaguar" },
  { image: axolotl, country: "México", animal: "Axolote" },
  // Canadá
  { image: moose, country: "Canadá", animal: "Alce" },
  { image: beaver, country: "Canadá", animal: "Castor" },
  // Argentina
  { image: guanaco, country: "Argentina", animal: "Guanaco" },
  { image: condor, country: "Argentina", animal: "Condor-andino" },
  // Reino Unido
  { image: redSquirrel, country: "Reino Unido", animal: "Esquilo-vermelho" },
  { image: highlandCow, country: "Reino Unido", animal: "Vaca das Terras Altas" },
  // Alemanha
  { image: hedgehog, country: "Alemanha", animal: "Ouriço-cacheiro" },
  { image: germanEagle, country: "Alemanha", animal: "Águia-real alemã" },
  // Espanha
  { image: iberianLynx, country: "Espanha", animal: "Lince-ibérico" },
  { image: spanishBull, country: "Espanha", animal: "Touro espanhol" },
  // Egito
  { image: fennecFox, country: "Egito", animal: "Raposa-fennec" },
  { image: camel, country: "Egito", animal: "Camelo" },
  { image: nileCrocodile, country: "Egito", animal: "Crocodilo-do-Nilo" },
  // Índia
  { image: bengalTiger, country: "Índia", animal: "Tigre-de-bengala" },
  { image: peacock, country: "Índia", animal: "Pavão" },
  { image: asianElephant, country: "Índia", animal: "Elefante asiático" },
  // Coreia do Sul
  { image: koreanMagpie, country: "Coreia do Sul", animal: "Pega-coreana" },
  { image: koreanTiger, country: "Coreia do Sul", animal: "Tigre coreano" },
  // Grécia
  { image: monkSeal, country: "Grécia", animal: "Foca-monge-do-mediterrâneo" },
  { image: greekTortoise, country: "Grécia", animal: "Tartaruga-grega" },
  // Portugal
  { image: iberianWolf, country: "Portugal", animal: "Lobo-ibérico" },
  { image: barcelosRooster, country: "Portugal", animal: "Galo de Barcelos" },
  // Brasil (extra)
  { image: goldenTamarin, country: "Brasil", animal: "Mico-leão-dourado" },
];

export const SOUND_QUESTIONS = [
  { word: "Olá!", country: "Brasil", language: "Português", lang: "pt-BR", audio: olaSnd },
  { word: "Hello!", country: "Estados Unidos", language: "Inglês", lang: "en-US", audio: helloSnd },
  { word: "你好", phonetic: "Nǐ hǎo", country: "China", language: "Mandarim", lang: "zh-CN", audio: nihaoSnd },
  { word: "Привет", phonetic: "Privet", country: "Rússia", language: "Russo", lang: "ru-RU", audio: privetSnd },
  { word: "こんにちは", phonetic: "Konnichiwa", country: "Japão", language: "Japonês", lang: "ja-JP", audio: konnichiwaSnd },
  { word: "Bonjour!", country: "França", language: "Francês", lang: "fr-FR", audio: bonjourSnd },
  { word: "Ciao!", country: "Itália", language: "Italiano", lang: "it-IT", audio: ciaoSnd },
  { word: "G'day mate!", country: "Austrália", language: "Inglês australiano", lang: "en-AU", audio: gdaySnd },
  { word: "¡Hola!", country: "México", language: "Espanhol", lang: "es-MX", audio: holaSnd },
  { word: "Sawubona", country: "África do Sul", language: "Zulu", lang: "zu-ZA", audio: sawubonaSnd },
];

export const MONUMENT_QUESTIONS = [
  // Brasil
  { image: christRedeemer, name: "Cristo Redentor", country: "Brasil" },
  { image: sugarloaf, name: "Pão de Açúcar", country: "Brasil" },
  { image: lencois, name: "Lençóis Maranhenses", country: "Brasil" },
  // EUA
  { image: liberty, name: "Estátua da Liberdade", country: "Estados Unidos" },
  { image: rushmore, name: "Monte Rushmore", country: "Estados Unidos" },
  // China
  { image: greatWall, name: "Grande Muralha", country: "China" },
  { image: forbiddenCity, name: "Cidade Proibida", country: "China" },
  // Rússia
  { image: stBasil, name: "Catedral de São Basílio", country: "Rússia" },
  { image: hermitage, name: "Museu Hermitage", country: "Rússia" },
  // Japão
  { image: himeji, name: "Castelo de Himeji", country: "Japão" },
  { image: mtFuji, name: "Monte Fuji", country: "Japão" },
  // África do Sul
  { image: tableMountain, name: "Table Mountain", country: "África do Sul" },
  { image: capeGoodHope, name: "Cabo da Boa Esperança", country: "África do Sul" },
  // França
  { image: eiffel, name: "Torre Eiffel", country: "França" },
  { image: montStMichel, name: "Mont Saint-Michel", country: "França" },
  // Itália
  { image: colosseum, name: "Coliseu", country: "Itália" },
  { image: pisa, name: "Torre de Pisa", country: "Itália" },
  // Austrália
  { image: operaHouse, name: "Casa de Ópera de Sydney", country: "Austrália" },
  { image: uluru, name: "Uluru (Ayers Rock)", country: "Austrália" },
  // México
  { image: chichenItza, name: "Chichén Itzá", country: "México" },
  { image: teotihuacan, name: "Teotihuacán", country: "México" },
];

export const ALL_COUNTRY_NAMES = [
  "Brasil",
  "Estados Unidos",
  "China",
  "Rússia",
  "Japão",
  "África do Sul",
  "França",
  "Itália",
  "Austrália",
  "México",
  "Argentina",
  "Canadá",
  "Reino Unido",
  "Alemanha",
  "Espanha",
  "Egito",
  "Índia",
  "Coreia do Sul",
  "Grécia",
  "Portugal",
];
