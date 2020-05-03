//


export function createStyleName(...specs: Array<StyleNameSpec>): string {
  let styleNames = [];
  for (let spec of specs) {
    if (spec !== null && spec !== undefined) {
      if (typeof spec === "string") {
        styleNames.push(spec);
      } else {
        if (spec.if && spec.true !== null && spec.true !== undefined) {
          styleNames.push(spec.true);
        } else if (!spec.if && spec.false !== null && spec.false !== undefined) {
          styleNames.push(spec.false);
        }
      }
    }
  }
  let styleName = styleNames.join(" ");
  return styleName;
}

type StyleNameSpec = Maybe<string> | {if: boolean, true?: Maybe<string>, false?: Maybe<string>};
type Maybe<T> = T | null | undefined;