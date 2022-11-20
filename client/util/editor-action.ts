//

import {
  Doc,
  Editor
} from "codemirror";


function getSurroundingStrings(doc: Doc, beforeLength: number, afterLength: number): {before: string, after: string} {
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  const before = doc.getRange({line: from.line, ch: from.ch - beforeLength}, from);
  const after = doc.getRange(to, {line: to.line, ch: to.ch + afterLength});
  return {before, after};
}

function addSurroundingStrings(doc: Doc, before: string, after: string): void {
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  console.log(from, to);
  console.log({line: to.line, ch: (from.line === to.line) ? to.ch + before.length : to.ch});
  doc.replaceRange(before, {line: from.line, ch: from.ch}, undefined, "+markdown");
  doc.replaceRange(after, {line: to.line, ch: (from.line === to.line) ? to.ch + before.length : to.ch}, undefined, "+markdown");
  setTimeout(() => doc.setSelection({line: from.line, ch: from.ch + before.length}, {line: to.line, ch: (from.line === to.line) ? to.ch + before.length : to.ch}), 0);
}

function removeSurroundingStrings(doc: Doc, beforeLength: number, afterLength: number): void {
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  doc.replaceRange("", {line: from.line, ch: from.ch - beforeLength}, from, "+markdown");
  doc.replaceRange("", {line: to.line, ch: (from.line === to.line) ? to.ch - beforeLength : to.ch}, {line: to.line, ch: (from.line === to.line) ? to.ch - beforeLength + afterLength : to.ch + afterLength}, "+markdown");
  setTimeout(() => doc.setSelection({line: from.line, ch: from.ch - beforeLength}, {line: to.line, ch: (from.line === to.line) ? to.ch - beforeLength : to.ch}), 0);
}

function getHeadString(doc: Doc, length: number): string {
  const from = doc.getCursor();
  const head = doc.getRange({line: from.line, ch: 0}, {line: from.line, ch: length});
  return head;
}

function addHeadString(doc: Doc, head: string): void {
  const from = doc.getCursor();
  const followingHead = doc.getRange({line: from.line, ch: head.length}, {line: from.line, ch: head.length + 1});
  const addedHead = (followingHead === " ") ? head : head + " ";
  doc.replaceRange(addedHead, {line: from.line, ch: 0}, undefined, "+markdown");
}

function removeHeadString(doc: Doc, length: number): void {
  const from = doc.getCursor();
  const followingSpaces = doc.getRange({line: from.line, ch: length}, {line: from.line + 1, ch: 0}).match(/^(\s*)/)![1];
  doc.replaceRange("", {line: from.line, ch: 0}, {line: from.line, ch: length + followingSpaces.length}, "+markdown");
}

function insertItalic(editor: Editor): void {
  const doc = editor.getDoc();
  const {before, after} = getSurroundingStrings(doc, 1, 1);
  if (before === "*" && after === "*") {
    removeSurroundingStrings(doc, 1, 1);
  } else {
    addSurroundingStrings(doc, "*", "*");
  }
}

function insertStrikethrough(editor: Editor): void {
  const doc = editor.getDoc();
  const {before, after} = getSurroundingStrings(doc, 2, 2);
  if (before === "~~" && after === "~~") {
    removeSurroundingStrings(doc, 2, 2);
  } else {
    addSurroundingStrings(doc, "~~", "~~");
  }
}

function insertCode(editor: Editor): void {
  const doc = editor.getDoc();
  const {before, after} = getSurroundingStrings(doc, 1, 1);
  if (before === "`" && after === "`") {
    removeSurroundingStrings(doc, 1, 1);
  } else {
    addSurroundingStrings(doc, "`", "`");
  }
}

function insertLink(editor: Editor): void {
  const doc = editor.getDoc();
  throw new Error("not implemented");
}

function insertImage(editor: Editor): void {
  const doc = editor.getDoc();
  throw new Error("not implemented");
}

function insertUnorderedList(editor: Editor): void {
  const doc = editor.getDoc();
  const head = getHeadString(doc, 1);
  if (head === "-") {
    removeHeadString(doc, 1);
  } else {
    addHeadString(doc, "-");
  }
}

function insertOrderedList(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor();
  doc.replaceRange("1. ", {line: from.line, ch: 0});
  throw new Error("not fully implemented");
}

function insertBlockquote(editor: Editor): void {
  const doc = editor.getDoc();
  const head = getHeadString(doc, 1);
  if (head === ">") {
    removeHeadString(doc, 1);
  } else {
    addHeadString(doc, ">");
  }
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