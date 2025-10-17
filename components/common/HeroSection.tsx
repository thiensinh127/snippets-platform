"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

const HeroSection = ({ session }: { session: any }) => {
  const t = useTranslations();

  return (
    <section className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        {t("common.title")}⚡️
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        {t("common.description")}
      </p>
      {!session ? (
        <Link href="/login">
          <Button size="lg" className="text-lg px-8">
            <Plus className="h-4 w-4 mr-2" />
            {t("common.addSnippet")}
          </Button>
        </Link>
      ) : (
        <Link href="/snippets/new">
          <Button size="lg" className="text-lg px-8">
            <Plus className="h-4 w-4 mr-2" />
            {t("common.addSnippet")}
          </Button>
        </Link>
      )}
    </section>
  );
};

export default HeroSection;
