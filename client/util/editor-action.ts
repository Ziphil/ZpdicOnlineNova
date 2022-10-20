//

import {
  Editor
} from "codemirror";


function insertItalic(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  doc.replaceRange("*", {line: from.line, ch: from.ch});
  doc.replaceRange("*", {line: to.line, ch: (from.line === to.line) ? to.ch + 1 : to.ch});
  setTimeout(() => doc.setSelection({line: from.line, ch: from.ch + 1}, {line: to.line, ch: (from.line === to.line) ? to.ch + 1 : to.ch}), 0);
}

function insertStrikethrough(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  doc.replaceRange("~~", {line: from.line, ch: from.ch});
  doc.replaceRange("~~", {line: to.line, ch: (from.line === to.line) ? to.ch + 2 : to.ch});
  setTimeout(() => doc.setSelection({line: from.line, ch: from.ch + 2}, {line: to.line, ch: (from.line === to.line) ? to.ch + 2 : to.ch}), 0);
}

function insertCode(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  doc.replaceRange("`", {line: from.line, ch: from.ch});
  doc.replaceRange("`", {line: to.line, ch: (from.line === to.line) ? to.ch + 1 : to.ch});
  setTimeout(() => doc.setSelection({line: from.line, ch: from.ch + 1}, {line: to.line, ch: (from.line === to.line) ? to.ch + 1 : to.ch}), 0);
}

function insertLink(editor: Editor): void {
  throw new Error("not implemented");
}

function insertImage(editor: Editor): void {
  throw new Error("not implemented");
}

function insertUnorderedList(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor();
  doc.replaceRange("- ", {line: from.line, ch: 0});
}

function insertOrderedList(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor();
  doc.replaceRange("1. ", {line: from.line, ch: 0});
}

function insertBlockquote(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor();
  doc.replaceRange("> ", {line: from.line, ch: 0});
}

function insertTable(editor: Editor): void {
  throw new Error("not implemented");
}

function insertCodeBlock(editor: Editor): void {
  throw new Error("not implemented");
}

export const MARKDOWN_EDITOR_ACTIONS = {
  italic: insertItalic,
  strikethrough: insertStrikethrough,
  code: insertCode,
  link: insertLink,
  image: insertImage,
  unorderedList: insertUnorderedList,
  orderedList: insertOrderedList,
  blockquote: insertBlockquote,
  table: insertTable,
  codeBlock: insertCodeBlock
} as const;