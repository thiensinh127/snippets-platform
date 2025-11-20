import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 9)
  );
}

export function analyzeComplexity(code: string): string {
  const lowerCode = code.toLowerCase();

  // Nested loops
  if (/(for|while)[\s\S]*?(for|while)/.test(lowerCode)) {
    return "O(n²)";
  }

  // Triple nested
  if (/(for|while)[\s\S]*?(for|while)[\s\S]*?(for|while)/.test(lowerCode)) {
    return "O(n³)";
  }

  // Sorting algorithms
  if (/sort|quicksort|mergesort|heapsort/.test(lowerCode)) {
    return "O(n log n)";
  }

  // Single loop
  if (/(for|while|foreach|map|filter|reduce)/.test(lowerCode)) {
    return "O(n)";
  }

  // Logarithmic (binary search)
  if (/binary.*search|binarysearch/.test(lowerCode)) {
    return "O(log n)";
  }

  // Constant
  return "O(1)";
}

export const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "SQL",
  "HTML",
  "CSS",
];

export const POPULAR_TAGS = [
  "algorithm",
  "data-structure",
  "sorting",
  "searching",
  "dynamic-programming",
  "recursion",
  "array",
  "string",
  "tree",
  "graph",
  "api",
  "frontend",
  "backend",
  "database",
  "utility",
];
