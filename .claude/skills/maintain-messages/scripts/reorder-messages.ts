//

import {readFileSync, writeFileSync} from "fs";
import {join} from "path";
import {LANGS, MESSAGE_DIRECTORY, SECTIONS, Section, getNamespaceSections} from "./lib-scan";


type Block = {
  key: string,
  lines: Array<string>,
  currentSection: Section | null,
  anchors: Array<string>,
  aliases: Array<string>
};

const SECTION_HEADER_REGEXP = /^#\s*(toast|atom|compound|form|page|other)\s*$/;
const ROOT_KEY_REGEXP = /^([A-Za-z0-9_]+):/;
const TOAST_CHILD_ORDER = ["success", "error"];

/** 各メッセージファイルを、セクション順 (`toast` → `atom` → `compound` → `form` → `page` → `other`) に整えます。
 * 各セクション内のルートキーはアルファベット順 (`toast` セクションは `success` → `error` の固定順) にします。
 * 各ルートキーの中身 (テキスト) は一切変更せず、ブロック単位で並び替えます。*/
function main(): void {
  const namespaceSections = getNamespaceSections();
  for (const lang of LANGS) {
    reorderFile(lang, namespaceSections);
  }
}

/** 1 つの言語ファイルを並び替えて上書きします。 */
function reorderFile(lang: string, namespaceSections: Map<string, Section>): void {
  const path = join(MESSAGE_DIRECTORY, `${lang}.yml`);
  const raw = readFileSync(path, "utf8");
  const lines = raw.split(/\r?\n/);
  const hadTrailingNewline = /\r?\n$/.test(raw);
  if (hadTrailingNewline) {
    lines.pop();
  }
  const blocks = parseRootBlocks(lines);
  const groupedBlocks = {} as Record<Section, Array<Block>>;
  for (const section of SECTIONS) {
    groupedBlocks[section] = [];
  }
  for (const block of blocks) {
    groupedBlocks[getSectionFor(block, namespaceSections)].push(block);
  }
  for (const section of SECTIONS) {
    if (section === "toast") {
      groupedBlocks[section] = groupedBlocks[section].map((block) => reorderToastBlock(block));
    } else {
      groupedBlocks[section] = sortBlocksAlphabetically(groupedBlocks[section]);
    }
  }
  const output = [] as Array<string>;
  SECTIONS.forEach((section, index) => {
    if (index > 0) {
      output.push("");
    }
    output.push(`# ${section}`);
    for (const block of groupedBlocks[section]) {
      output.push(...block.lines);
    }
  });
  const eol = "\r\n";
  let result = output.join(eol);
  if (hadTrailingNewline) {
    result += eol;
  }
  writeFileSync(path, result, "utf8");
  const total = (Object.values(groupedBlocks)).reduce((sum, list) => sum + list.length, 0);
  if (blocks.length !== total) {
    throw new Error(`${lang}.yml: ブロック数が一致しません (並び替えで欠落が発生)`);
  }
  console.log(`[${lang}.yml] 整形完了: ルートキー ${blocks.length} 件`);
}

/** 行配列を、セクションコメントと空行を除いたルートキーのブロックに分割します。
 * 各ブロックは現在所属しているセクション (`currentSection`) も保持します。*/
function parseRootBlocks(lines: Array<string>): Array<Block> {
  const blocks = [] as Array<Block>;
  let currentSection = null as Section | null;
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const headerMatch = line.match(SECTION_HEADER_REGEXP);
    if (headerMatch !== null) {
      currentSection = headerMatch[1] as Section;
      index ++;
    } else if (/^\s*$/.test(line)) {
      index ++;
    } else if (/^\S/.test(line) && ROOT_KEY_REGEXP.test(line)) {
      const blockLines = [line];
      index ++;
      while (index < lines.length && !/^\S/.test(lines[index]) && !/^#/.test(lines[index])) {
        blockLines.push(lines[index]);
        index ++;
      }
      while (blockLines.length > 0 && /^\s*$/.test(blockLines[blockLines.length - 1])) {
        blockLines.pop();
      }
      const text = blockLines.join("\n");
      const anchors = [...text.matchAll(/:\s+&([\w.]+)(?:\s|$)/g)].map((match) => match[1]);
      const aliases = [...text.matchAll(/:\s+\*([\w.]+)\s*$/gm)].map((match) => match[1]);
      blocks.push({key: line.match(ROOT_KEY_REGEXP)![1], lines: blockLines, currentSection, anchors, aliases});
    } else {
      index ++;
    }
  }
  return blocks;
}

/** セクション内のルートキーをアルファベット順に並び替えます。
 * ただし YAML のアンカー (`&`) / エイリアス (`*`) の依存関係を尊重し、エイリアスを使うブロックは必ずアンカーを定義するブロックより後ろに来るようにします (辞書順最小のトポロジカル順序)。
 * これを守らないと参照先が見つからず YAML が壊れます。*/
function sortBlocksAlphabetically(blocks: Array<Block>): Array<Block> {
  const definerMap = new Map<string, string>();
  for (const block of blocks) {
    for (const anchor of block.anchors) {
      definerMap.set(anchor, block.key);
    }
  }
  const dependencies = new Map<string, Set<string>>(blocks.map((block) => [block.key, new Set<string>()]));
  for (const block of blocks) {
    for (const alias of block.aliases) {
      const definer = definerMap.get(alias);
      if (definer !== undefined && definer !== block.key) {
        dependencies.get(block.key)!.add(definer);
      }
    }
  }
  const blockMap = new Map(blocks.map((block) => [block.key, block]));
  const remainingBlocks = new Set(blocks.map((block) => block.key));
  const result = [] as Array<Block>;
  while (remainingBlocks.size > 0) {
    let ready = [...remainingBlocks].filter((key) => [...dependencies.get(key)!].every((dep) => !remainingBlocks.has(dep)));
    if (ready.length === 0) {
      console.warn("警告: アンカー依存に循環を検出しました。アルファベット順で解消します。");
      ready = [...remainingBlocks];
    }
    ready.sort((one, other) => one.localeCompare(other));
    const next = ready[0];
    result.push(blockMap.get(next)!);
    remainingBlocks.delete(next);
  }
  return result;
}

/** ブロックの所属セクションを決める。
 * 優先順位は、`toast` ルートキー → コードから導出したセクション → 現在の所属セクション → `other`。*/
function getSectionFor(block: Block, namespaceSections: Map<string, Section>): Section {
  if (block.key === "toast") {
    return "toast";
  } else if (namespaceSections.has(block.key)) {
    return namespaceSections.get(block.key)!;
  } else if (block.currentSection !== null && (SECTIONS as ReadonlyArray<string>).includes(block.currentSection)) {
    return block.currentSection;
  } else {
    return "other";
  }
}

/** `toast` ブロックの子キー (`indent` 2) を `success` → `error` の順に並び替える。 */
function reorderToastBlock(block: Block): Block {
  const [head, ...rest] = block.lines;
  const children = [] as Array<{key: string, lines: Array<string>}>;
  let current = null as {key: string, lines: Array<string>} | null;
  for (const line of rest) {
    if (/^ {2}\S/.test(line)) {
      current = {key: line.match(/^ {2}([A-Za-z0-9_]+):/)?.[1] ?? "", lines: [line]};
      children.push(current);
    } else if (current !== null) {
      current.lines.push(line);
    }
  }
  children.sort((one, other) => orderIndex(one.key) - orderIndex(other.key));
  return {...block, lines: [head, ...children.flatMap((child) => child.lines)]};
}

/** `toast` の子キーの並び順インデックス (未知のキーは末尾)。 */
function orderIndex(key: string): number {
  const index = TOAST_CHILD_ORDER.indexOf(key);
  return (index >= 0) ? index : TOAST_CHILD_ORDER.length;
}

main();
