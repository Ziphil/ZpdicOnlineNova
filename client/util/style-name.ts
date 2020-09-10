//


export class StyleNameUtil {

  private static createArray(...specs: Array<StyleNameSpec>): Array<string> {
    let styleNames = [];
    for (let spec of specs) {
      if (spec !== null && spec !== undefined) {
        if (typeof spec === "string") {
          styleNames.push(spec);
        } else if (Array.isArray(spec)) {
          styleNames.push(...this.createArray(...spec));
        } else {
          if (spec.if && spec.true !== null && spec.true !== undefined) {
            styleNames.push(spec.true);
          } else if (!spec.if && spec.false !== null && spec.false !== undefined) {
            styleNames.push(spec.false);
          }
        }
      }
    }
    return styleNames;
  }

  public static create(...specs: Array<StyleNameSpec>): string {
    let styleName = this.createArray(...specs).join(" ");
    return styleName;
  }

}


type StyleNameSpec = {if: boolean, true?: MaybeString, false?: MaybeString} | MaybeString | Array<StyleNameSpec>;
type MaybeString = string | null | undefined;