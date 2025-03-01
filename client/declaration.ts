//


declare module "*.svg" {

  let data: any;
  export default data;

}


declare module "*.yml" {

  let data: Record<string, string>;
  export default data;

}


declare module "*.md" {

  let data: string;
  export default data;

}


declare module "markdown-truncate" {

  function truncateMarkdown(string: string, options: {limit: number, ellipsis?: boolean}): string;
  export default truncateMarkdown;

}