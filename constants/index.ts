export const LANGUAGES = [
  "Text",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Dart",
  "R",
  "SQL",
  "HTML",
  "CSS",
  "SCSS",
  "Less",
  "JSON",
  "XML",
  "YAML",
  "Markdown",
  "Shell",
  "Bash",
  "PowerShell",
  "Dockerfile",
  "Other",
];
export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function normalizeTags(
  input: unknown
): { name: string; slug: string }[] {
  if (!Array.isArray(input)) return [];
  const uniq = Array.from(
    new Set(
      input.map((t) => (typeof t === "string" ? t.trim() : "")).filter(Boolean)
    )
  );
  return uniq.map((name) => ({ name, slug: slugify(name) }));
}
