"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const NewSnippetModal = dynamic(
  () => import("../snippets/SnippetUpsertModal"),
  {
    ssr: false,
  }
);

const HeroSection = ({ session }: { session: any }) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  return (
    <section className="container mx-auto px-4 py-12 text-center">
      {!session ? (
        <>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("common.title")}⚡️
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t("common.description")}
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8">
              <Plus className="h-4 w-4 mr-2" />
              {t("common.addSnippet")}
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("common.title")}⚡️
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t("common.description")}
          </p>
          <Button size="lg" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("common.addSnippet")}
          </Button>
        </>
      )}
      {open && (
        <NewSnippetModal mode="create" open={open} onOpenChange={setOpen} />
      )}
    </section>
  );
};

export default HeroSection;
