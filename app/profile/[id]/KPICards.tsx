import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Code2, Eye, Lock, TrendingUp } from "lucide-react";

async function KPICards({ userId }: { userId: string }) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      snippets: { select: { isPublic: true, views: true } },
    },
  });
  if (!data) return null;
  const total = data.snippets.length;
  const publicCount = data.snippets.filter((s) => s.isPublic).length;
  const privateCount = total - publicCount;
  const totalViews = data.snippets.reduce((sum, s) => sum + (s.views || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Code2
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                aria-hidden
              />
            </div>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">Snippets</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Eye
                className="h-5 w-5 text-green-600 dark:text-green-400"
                aria-hidden
              />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalViews}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp
                className="h-5 w-5 text-purple-600 dark:text-purple-400"
                aria-hidden
              />
            </div>
            <div>
              <p className="text-2xl font-bold">{publicCount}</p>
              <p className="text-xs text-muted-foreground">Public</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Lock
                className="h-5 w-5 text-orange-600 dark:text-orange-400"
                aria-hidden
              />
            </div>
            <div>
              <p className="text-2xl font-bold">{privateCount}</p>
              <p className="text-xs text-muted-foreground">Private</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default KPICards;
