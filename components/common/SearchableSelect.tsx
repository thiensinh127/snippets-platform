"use client";

import * as React from "react";
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
} from "@/components/ui/command";
import {
  ArrowDown,
  ArrowDown01,
  ArrowDownIcon,
  Check,
  ChevronDown,
  ChevronsDown,
  ChevronsDownIcon,
  ChevronsUpDown,
  LucideChevronsDown,
  MoveDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { label: string; value: string };

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Select language"
          className={cn("w-[150px] justify-between", className)}
          disabled={disabled}
        >
          <span
            className={cn(
              selected ? "text-foreground" : "text-muted-foreground",
              "truncate"
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search…" aria-label="Search languages" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup role="listbox">
              {options.map((o, i) => (
                <CommandItem
                  key={o.value + i}
                  value={o.label}
                  onSelect={() => {
                    onChange?.(o.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      o.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
