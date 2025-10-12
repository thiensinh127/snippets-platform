import { getTranslations } from "next-intl/server";

export default async function SiteFooter() {
  const t = await getTranslations();
  return (
    <footer className="mt-auto border-t py-8 bg-white/50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>{t("common.footer")}</p>
      </div>
    </footer>
  );
}
