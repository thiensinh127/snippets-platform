"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function DeleteButton({ snippetId }: { snippetId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this snippet? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const res = await fetch(`/api/snippets/${snippetId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/")
        router.refresh()
      } else {
        const error = await res.json()
        alert(error.error || "Failed to delete snippet")
        setIsDeleting(false)
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Something went wrong")
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      size="sm" 
      variant="destructive" 
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  )
}