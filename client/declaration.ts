//


declare module "*.yml" {

  let data: Record<string, string>;
  export default data;

}


declare module "*.md" {

  let data: string;
  export default data;

}


declare module "codemirror" {

  function defineSimpleMode(language: string, definition: {[key: string]: Array<object>}): void;

}