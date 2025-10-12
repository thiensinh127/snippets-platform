"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const SUPPORTED = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
]

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState("en")

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
    if (match?.[1]) setLocale(decodeURIComponent(match[1]))
  }, [])

  function changeLocale(code: string) {
    document.cookie = `NEXT_LOCALE=${encodeURIComponent(code)}; path=/; max-age=${60 * 60 * 24 * 365}`
    setLocale(code)
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {SUPPORTED.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => changeLocale(l.code)}
            className={locale === l.code ? "font-semibold" : ""}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
