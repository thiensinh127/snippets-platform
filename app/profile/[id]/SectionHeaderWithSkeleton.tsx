function SectionHeaderWithSkeleton({
  title,
  countSkeleton = false,
}: {
  title: string;
  countSkeleton?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      {countSkeleton ? (
        <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      ) : null}
    </div>
  );
}

export default SectionHeaderWithSkeleton;
