"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import DeleteButton from "../common/DeleteButton";

export function SnippetActionsMenu({
  snippetId,
  editHref,
}: {
  snippetId: string;
  editHref: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Quan trọng: stopPropagation ở Client Component */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-8"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem asChild>
          <Link
            href={editHref}
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <div className="flex justify-center cursor-pointer">
            <DeleteButton
              variant="outline"
              className="border-none w-full"
              snippetId={snippetId}
            />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
