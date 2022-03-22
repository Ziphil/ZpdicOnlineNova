//


export class DataUtil {

  private static toSnake(string: string): string {
    return string.replace(/([A-Z])/g, (char) => "_" + char.toLowerCase());
  }

  public static create(object: Record<string, DataSpec>): Record<`data-${string}`, string> {
    let dataEntries = [];
    for (let [name, spec] of Object.entries(object)) {
      let snakeName = DataUtil.toSnake(name);
      if (spec !== null && spec !== undefined) {
        if (typeof spec === "string") {
          dataEntries.push([`data-${snakeName}`, spec]);
        } else {
          if (spec.if && spec.true !== null && spec.true !== undefined) {
            dataEntries.push([`data-${snakeName}`, spec.true]);
          } else if (!spec.if && spec.false !== null && spec.false !== undefined) {
            dataEntries.push([`data-${snakeName}`, spec.false]);
          }
        }
      }
    }
    let data = Object.fromEntries(dataEntries);
    return data;
  }

}


type DataSpec = {if: boolean, true?: MaybeString, false?: MaybeString} | MaybeString;
type MaybeString = string | null | undefined;