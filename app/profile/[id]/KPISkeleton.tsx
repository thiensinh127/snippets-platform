import { Card, CardContent } from "@/components/ui/card";

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse h-9 w-9" />
              <div>
                <div className="h-6 w-14 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-1" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default KPISkeleton;
