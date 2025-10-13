import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/common/ThemeToggle";
import { getTranslations } from "next-intl/server";
import MobileNav from "@/components/common/MobileNav";

export default async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations();

  return (
    <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">{t("common.brand")}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {session ? (
            <>
              <Link href={`/profile/${session.user.id}`}>
                <Button variant="outline">{t("common.profile")}</Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="ghost">{t("common.signOut")}</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t("common.signIn")}</Button>
              </Link>
              <Link href="/register">
                <Button>{t("common.signUp")}</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="sm:hidden">
          <MobileNav
            isAuthenticated={!!session}
            profileHref={session ? `/profile/${session.user.id}` : undefined}
          />
        </div>
      </div>
    </header>
  );
}
