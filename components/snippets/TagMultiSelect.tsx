"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { slugify } from "@/constants";

export type TagOption = { label: string; value: string };

type Props = {
  value: string[]; // selected values (slug/name)
  onChange: (vals: string[]) => void; // setter
  options: TagOption[]; // available options
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function TagMultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select or create tags",
  disabled,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const map = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const o of options) m.set(o.value, o.label);
    return m;
  }, [options]);

  const selectedLabels = value.map((v) => map.get(v) ?? v);

  const exists = (label: string) =>
    options.some((o) => o.label.toLowerCase() === label.toLowerCase()) ||
    value.some((v) => v.toLowerCase() === label.toLowerCase());

  function toggle(val: string) {
    if (value.includes(val)) onChange(value.filter((v) => v !== val));
    else onChange([...value, val]);
  }

  function handleCreate(label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    const val = slugify(trimmed);
    if (!value.includes(val)) onChange([...value, val]);
    setQuery("");
    setOpen(false);
  }

  const MAX_SHOW = 2;
  const extraCount = Math.max(0, selectedLabels.length - MAX_SHOW);
  const visibleLabels = selectedLabels.slice(0, MAX_SHOW);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label="Select or create tags"
            className={cn(
              "w-full justify-between gap-2",
              "min-h-10 px-3 py-2",
              "overflow-hidden"
            )}
            disabled={disabled}
          >
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
              {visibleLabels.length > 0 ? (
                <div className="flex min-w-0 flex-wrap items-center gap-1">
                  {visibleLabels.map((label, i) => (
                    <Badge
                      key={`${label}-${i}`}
                      variant="secondary"
                      className="shrink-0 text-[11px]"
                    >
                      {label}
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 rounded p-0.5 hover:bg-black/10 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(value.filter((_, idx) => idx !== i));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            onChange(value.filter((_, idx) => idx !== i));
                          }
                        }}
                        aria-label={`Remove ${label}`}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  ))}
                  {extraCount > 0 && (
                    <Badge variant="outline" className="shrink-0 text-[11px]">
                      +{extraCount}
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="truncate text-muted-foreground">
                  {placeholder}
                </span>
              )}
            </div>

            {/* RIGHT: caret */}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search or create…"
              value={query}
              onValueChange={setQuery}
              aria-label="Search or create tags"
            />
            <CommandList>
              <CommandEmpty>
                {query.trim() ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No results
                  </div>
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Type to search
                  </div>
                )}
              </CommandEmpty>

              {!!options.length && (
                <CommandGroup heading="Available" role="listbox">
                  {options
                    .filter((o) =>
                      o.label.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((o) => (
                      <CommandItem
                        key={o.value}
                        value={o.value}
                        onSelect={() => toggle(o.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.includes(o.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {o.label}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              <CommandSeparator />

              {/* Create new (local only) */}
              <CommandGroup>
                <CommandItem
                  disabled={!query.trim() || exists(query)}
                  onSelect={() => handleCreate(query.trim())}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create “{query.trim() || "…"}”
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
