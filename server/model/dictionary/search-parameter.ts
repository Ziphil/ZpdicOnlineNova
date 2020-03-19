//


export class NormalSearchParameter {

  public search: string;
  public mode: SearchMode;
  public type: SearchType;

  public constructor(search: string, mode: SearchMode, type: SearchType) {
    this.search = search;
    this.mode = mode;
    this.type = type;
  }

}


type SearchMode = "name" | "equivalent" | "both" | "content";
type SearchType = "exact" | "prefix" | "suffix" | "part" | "regular";

export function toSearchMode(mode: string): SearchMode {
  let nextMode = "name" as SearchMode;
  if (mode === "name" || mode === "equivalent" || mode === "both" || mode === "content") {
    nextMode = mode;
  }
  return nextMode;
}

export function toSearchType(type: string): SearchType {
  let nextType = "exact" as SearchType;
  if (type === "exact" || type === "prefix" || type === "suffix" || type === "part" || type === "regular") {
    nextType = type;
  }
  return nextType;
}