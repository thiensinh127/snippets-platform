"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";

const NewSnippetModal = dynamic(() => import("../snippets/NewSnippetModal"), {
  ssr: false,
});

const HeroSection = ({ session }: { session: any }) => {
  const [open, setOpen] = useState(false);
  return (
    <section className="container mx-auto px-4 py-12 text-center">
      {!session ? (
        <Link href="/register">
          <Button size="lg" className="text-lg px-8">
            Get Started Free
          </Button>
        </Link>
      ) : (
        <Button size="lg" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Snippet
        </Button>
      )}
      {open && <NewSnippetModal open={open} onOpenChange={setOpen} />}
    </section>
  );
};

export default HeroSection;
