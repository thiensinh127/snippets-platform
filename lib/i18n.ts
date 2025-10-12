export const locales = ["en", "vi"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";

export function isLocale(input: string | undefined | null): input is Locale {
  return !!input && (locales as readonly string[]).includes(input);
}
