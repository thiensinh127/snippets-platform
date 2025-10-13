import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SnippetDTO } from "@/types/snippet";
import { Suspense } from "react";
import { SnippetCard } from "./SnippetCard";

function SnippetCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-4">
          <div className="h-5 w-12 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-gray-200 rounded-md p-3 mb-4 h-20"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
      ßß
    </Card>
  );
}

export default function LazySnippetCard({ snippet }: { snippet: SnippetDTO }) {
  return (
    <Suspense fallback={<SnippetCardSkeleton />}>
      <SnippetCard snippet={snippet} />
    </Suspense>
  );
}
