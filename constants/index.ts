export const LANGUAGES: Record<string, string> = {
  // 📝 General
  txt: "Text",
  md: "Markdown",
  json: "JSON",
  yaml: "YAML",
  xml: "XML",

  // 💻 Web
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  less: "Less",

  // ⚙️ Programming Languages
  js: "JavaScript",
  ts: "TypeScript",
  py: "Python",
  java: "Java",
  c: "C++",
  cs: "C#",
  go: "Go",
  rs: "Rust",
  php: "PHP",
  rb: "Ruby",
  swift: "Swift",
  kt: "Kotlin",
  dart: "Dart",
  r: "R",
  sql: "SQL",

  // 🐚 Shell & DevOps
  sh: "Shell",
  bash: "Bash",
  ps1: "PowerShell",
  docker: "Dockerfile",

  // 🔧 Other
  other: "Other",
};

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

export const TAG_COLORS = [
  { bg: "bg-red-100", text: "text-red-600", border: "border-red-300" },
  { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-300" },
  { bg: "bg-green-100", text: "text-green-600", border: "border-green-300" },
  { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-300" },
  { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-300" },
];
