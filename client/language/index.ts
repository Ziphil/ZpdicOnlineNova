//


export const LANGUAGES = [
  {locale: "ja", name: "日本語", fetchMessages: () => import("./ja.yml" as any)},
  {locale: "en", name: "English", fetchMessages: () => import("./en.yml" as any)}
];