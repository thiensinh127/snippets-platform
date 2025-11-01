import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

import { Menu } from "lucide-react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/common/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MobileNavProps = {
  isAuthenticated: boolean;
  profileHref?: string;
};

export default async function MobileNav({
  isAuthenticated,
  profileHref,
}: MobileNavProps) {
  const t = await getTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-2" align="end">
        <DropdownMenuGroup>
          <div className="px-2 py-1.5 flex items-center justify-between">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <>
            {profileHref && (
              <Link href={profileHref}>
                <DropdownMenuItem className="cursor-pointer">
                  {t("common.profile")}
                </DropdownMenuItem>
              </Link>
            )}
            <Link href="/api/auth/signout">
              <DropdownMenuItem className="cursor-pointer">
                {t("common.signOut")}
              </DropdownMenuItem>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login">
              <DropdownMenuItem className="cursor-pointer">
                {t("common.signIn")}
              </DropdownMenuItem>
            </Link>
            <Link href="/register">
              <DropdownMenuItem className="cursor-pointer">
                {t("common.signUp")}
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
