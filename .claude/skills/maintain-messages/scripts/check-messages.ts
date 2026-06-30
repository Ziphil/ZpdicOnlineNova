//

import {LANGS, Lang, References, getAtPath, getNamespaceSections, getReferences, loadMessages} from "./lib-scan";


type MissingEntry = {
  path: string,
  namespace: string,
  section: string,
  rootKeyExists: boolean,
  jaExists: boolean,
  jaValue: string | null
};

/** コードが参照しているメッセージキーのうち、各言語のメッセージファイルに存在しないものを検出して報告します。
 * 破壊的な変更は行わず、レポートを出力するだけです。*/
function main(): void {
  const {static: staticReferences, dynamic: dynamicReferences, unresolved: unresolvedReferences} = getReferences();
  const namespaceSections = getNamespaceSections();
  const messages = Object.fromEntries(LANGS.map((lang) => [lang, loadMessages(lang)])) as Record<Lang, Record<string, unknown>>;
  const missingEntries = Object.fromEntries(LANGS.map((lang) => [lang, [] as Array<MissingEntry>])) as Record<Lang, Array<MissingEntry>>;
  const sortedPaths = [...staticReferences.entries()].sort((one, other) => one[0].localeCompare(other[0]));
  for (const [fullPath, info] of sortedPaths) {
    const jaNode = getAtPath(messages.ja, fullPath);
    const jaExists = jaNode !== undefined;
    const jaValue = (typeof jaNode === "string") ? jaNode : null;
    const section = (info.namespace === "toast") ? "toast" : (namespaceSections.get(info.namespace) ?? "other");
    for (const lang of LANGS) {
      const node = getAtPath(messages[lang], fullPath);
      if (node === undefined) {
        missingEntries[lang].push({
          path: fullPath,
          namespace: info.namespace,
          section,
          rootKeyExists: info.namespace in messages[lang],
          jaExists,
          jaValue: (lang === "ja") ? null : (jaExists) ? jaValue : null
        });
      }
    }
  }
  printReport(missingEntries, dynamicReferences, unresolvedReferences);
}

/** レポートを人間向けの要約と機械可読な JSON の両方で出力します。 */
function printReport(missingEntries: Record<Lang, Array<MissingEntry>>, dynamicReferences: References["dynamic"], unresolvedReferences: References["unresolved"]): void {
  const lines = [] as Array<string>;
  lines.push("===== メッセージファイル整備レポート =====");
  lines.push("");
  for (const lang of LANGS) {
    lines.push(`[${lang}.yml] 未設定のキー: ${missingEntries[lang].length} 件`);
    for (const entry of missingEntries[lang]) {
      const hint = (entry.jaValue !== null) ? `翻訳元(ja): ${JSON.stringify(entry.jaValue)}` : "→ <NOT SET> を設定";
      const root = (entry.rootKeyExists) ? "" : ` [新規ルートキー: ${entry.namespace} / section=${entry.section}]`;
      lines.push(`  - ${entry.path}  ${hint}${root}`);
    }
    lines.push("");
  }
  lines.push(`[動的キー] テンプレートリテラルで組み立てられ自動解決できない参照: ${dynamicReferences.length} 件 (手動確認)`);
  for (const entry of dynamicReferences) {
    lines.push(`  - ${entry.raw}  (scope=${entry.scope ?? "?"})  @ ${entry.file}`);
  }
  lines.push("");
  lines.push(`[スコープ未特定] useTrans のスコープを一意に解決できない参照: ${unresolvedReferences.length} 件 (手動確認)`);
  for (const entry of unresolvedReferences) {
    lines.push(`  - ${entry.raw}  @ ${entry.file}`);
  }
  lines.push("");
  lines.push("===== JSON =====");
  console.log(lines.join("\n"));
  console.log(JSON.stringify({missing: missingEntries, dynamic: dynamicReferences, unresolved: unresolvedReferences}, null, 2));
}

main();
