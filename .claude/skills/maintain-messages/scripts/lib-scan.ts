//

import {readFileSync, readdirSync, statSync} from "fs";
import {join, relative, resolve, sep} from "path";
import yaml from "yaml";


const parseYaml = yaml.parse;

export const REPO_ROOT = resolve(__dirname, "../../../..");
export const CLIENT_DIRECTORY = join(REPO_ROOT, "client");
export const COMPONENT_DIRECTORY = join(CLIENT_DIRECTORY, "component");
export const MESSAGE_DIRECTORY = join(CLIENT_DIRECTORY, "message");

export const LANGS = ["ja", "en", "eo"] as const;
export const SECTIONS = ["toast", "atom", "compound", "form", "page", "other"] as const;
export const COMPONENT_SECTIONS = ["atom", "compound", "form", "page"] as const;

export type Lang = (typeof LANGS)[number];
export type Section = (typeof SECTIONS)[number];

export type StaticReference = {namespace: string};
export type DynamicReference = {file: string, scope: string | null, namespace: string | null, raw: string, prefix: string};
export type UnresolvedReference = {file: string, raw: string};
export type References = {
  static: Map<string, StaticReference>,
  dynamic: Array<DynamicReference>,
  unresolved: Array<UnresolvedReference>,
  owned: Set<string>
};

/** ディレクトリ以下の .ts ファイルと .tsx ファイルを再帰的に集めます。 */
function collectSourceFiles(directory: string): Array<string> {
  const results = [] as Array<string>;
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (/\.tsx?$/.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

/** ソースファイルのパスから所属セクションを判定します (`component` 配下でなければ `other`)。 */
function getSectionFromPath(file: string): Section {
  const relativeFile = relative(COMPONENT_DIRECTORY, file);
  if (relativeFile.startsWith("..")) {
    return "other";
  } else {
    const top = relativeFile.split(sep)[0] as Section;
    return ((COMPONENT_SECTIONS as ReadonlyArray<string>).includes(top)) ? top : "other";
  }
}

/** 指定言語のメッセージファイルをパースしてオブジェクトを返します。 */
export function loadMessages(lang: Lang): Record<string, unknown> {
  return parseYaml(readFileSync(join(MESSAGE_DIRECTORY, `${lang}.yml`), "utf8")) ?? {};
}

/** ドット区切りパスでオブジェクトを辿り、存在しなければ `undefined` を返します。 */
export function getAtPath(messageObject: unknown, dottedPath: string): unknown {
  let current = messageObject ;
  for (const segment of dottedPath.split(".")) {
    if (current !== null && current !== undefined && typeof current === "object" && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

/** プロジェクトが所有する名前空間の集合を返します。
 * 既存のメッセージファイルのルートキーおよび `client/component` 配下のフォルダ名 (camelCase) から成ります。
 * これに含まれない名前空間 (zographia 組み込みの `common`, `pagination` など) は管理対象外とします。*/
export function getOwnedNamespaces(): Set<string> {
  const ownedNamespaces = new Set<string>();
  for (const section of COMPONENT_SECTIONS) {
    const directory = join(COMPONENT_DIRECTORY, section);
    let entries = [] as Array<string>;
    try {
      entries = readdirSync(directory);
    } catch {
      entries = [];
    }
    for (const entry of entries) {
      try {
        if (statSync(join(directory, entry)).isDirectory()) {
          ownedNamespaces.add(toCamelCase(entry));
        }
      } catch {
      }
    }
  }
  for (const lang of LANGS) {
    for (const key of Object.keys(loadMessages(lang))) {
      ownedNamespaces.add(key);
    }
  }
  return ownedNamespaces;
}

/** 名前空間 (`useTrans` の引数) ごとに、その `useTrans` が呼ばれているコンポーネントのセクションを対応付けます。
 * 新規にルートキーを追加する際の配置セクションの判定に使います。*/
export function getNamespaceSections(): Map<string, Section> {
  const namespaceSections = new Map<string, Section>();
  for (const file of collectSourceFiles(CLIENT_DIRECTORY)) {
    const text = readFileSync(file, "utf8");
    const section = getSectionFromPath(file);
    const regexp = /useTrans\(\s*"([^"]+)"\s*\)/g;
    let match = null as RegExpExecArray | null;
    while ((match = regexp.exec(text)) !== null) {
      const namespace = match[1];
      const previous = namespaceSections.get(namespace);
      if (previous === undefined || (previous === "other" && section !== "other")) {
        namespaceSections.set(namespace, section);
      }
    }
  }
  return namespaceSections;
}

/** `client` 以下のコードを走査し、`trans`, `transNode` が参照しているメッセーキーを収集します。
 * - `static` — 静的に解決できた完全パス (`Map<fullPath, {namespace}>`)。
 * - `dynamic` — テンプレートリテラルで動的に組み立てられ完全には解決できない参照 (手動確認用)。
 * - `unresolved` — `useTrans` のスコープを一意に特定できず解決できなかった参照 (手動確認用)。
 * - `owned` — プロジェクトが所有する名前空間の集合。*/
export function getReferences(): References {
  const ownedNamespaces = getOwnedNamespaces();
  const staticReferences = new Map<string, StaticReference>();
  const dynamicReferences = [] as Array<DynamicReference>;
  const unresolvedReferences = [] as Array<UnresolvedReference>;
  for (const file of collectSourceFiles(CLIENT_DIRECTORY)) {
    const text = readFileSync(file, "utf8");
    const relativeFile = relative(REPO_ROOT, file).split(sep).join("/");
    const scopes = new Set<string>();
    const scopeRegexp = /useTrans\(\s*"([^"]*)"\s*\)/g;
    let scopeMatch = null as RegExpExecArray | null;
    while ((scopeMatch = scopeRegexp.exec(text)) !== null) {
      scopes.add(scopeMatch[1]);
    }
    const scope = (scopes.size === 1) ? [...scopes][0] : null;
    const callRegexp = /\b(?:trans|transNode)\(\s*(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
    let callMatch = null as RegExpExecArray | null;
    while ((callMatch = callRegexp.exec(text)) !== null) {
      const literal = callMatch[1];
      const quote = literal[0];
      const inner = literal.slice(1, -1);
      const dynamic = quote === "`" && inner.includes("${");
      if (dynamic) {
        const namespace = (inner.startsWith(":")) ? inner.slice(1).split(".")[0] : scope;
        if (namespace === null || ownedNamespaces.has(namespace)) {
          dynamicReferences.push({file: relativeFile, scope, namespace, raw: literal, prefix: inner.slice(0, inner.indexOf("${"))});
        }
      } else {
        let fullPath = null as string | null;
        if (inner.startsWith(":")) {
          fullPath = inner.slice(1);
        } else if (scope !== null) {
          fullPath = `${scope}.${inner}`;
        } else {
          unresolvedReferences.push({file: relativeFile, raw: literal});
        }
        if (fullPath !== null) {
          const namespace = fullPath.split(".")[0];
          if (ownedNamespaces.has(namespace) && !staticReferences.has(fullPath)) {
            staticReferences.set(fullPath, {namespace});
          }
        }
      }
    }
  }
  return {static: staticReferences, dynamic: dynamicReferences, unresolved: unresolvedReferences, owned: ownedNamespaces};
}

function toCamelCase(name: string): string {
  const parts = name.split("-");
  return parts[0] + parts.slice(1).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}