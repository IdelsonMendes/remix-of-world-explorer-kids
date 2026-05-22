import { Globe, LogIn, LayoutDashboard, LogOut, UserCog, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { getAvatarSrc, usePassport } from "@/context/PassportContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { isLoggedIn, avatar, explorerName, logout } = usePassport();
  const avatarSrc = getAvatarSrc(avatar);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center h-10 w-10 rounded-2xl bg-gradient-sunset shadow-sticker text-white group-hover:rotate-12 transition-transform">
            <Globe className="h-5 w-5" />
          </span>
          <span className="font-display font-bold text-lg leading-none">
            Exploradores <span className="text-primary">do Mundo</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-foreground/80">
          <Link to="/" hash="mapa" className="hover:text-primary transition">Mapa</Link>
          <Link to="/" hash="jogos" className="hover:text-primary transition">Brincadeiras</Link>
          <Link to="/" hash="passaporte" className="hover:text-primary transition">Passaporte</Link>
          <Link to="/" hash="familia" className="hover:text-primary transition">Para a família</Link>
        </nav>
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-3 sm:px-4 py-2 text-sm font-bold shadow-sticker hover:-translate-y-0.5 transition outline-none">
              <img src={avatarSrc} alt={explorerName} className="h-6 w-6 rounded-full object-contain bg-white/20" />
              <span className="hidden sm:inline">{explorerName}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Oi, {explorerName}! 👋</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/lobby" className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Meu lobby
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/conta" className="cursor-pointer">
                  <UserCog className="h-4 w-4 mr-2" /> Minha conta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow-sticker hover:-translate-y-0.5 transition"
          >
            <LogIn className="h-4 w-4" /> Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
