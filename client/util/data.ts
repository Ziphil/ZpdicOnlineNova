//


export class DataUtil {

  private static toSnakeCase(string: string): string {
    return string.replace(/([A-Z])/g, (char) => "-" + char.toLowerCase());
  }

  public static create(object: Record<string, string | boolean | null | undefined>): Record<`data-${string}`, string> {
    let dataEntries = [];
    for (let [name, spec] of Object.entries(object)) {
      let snakeName = DataUtil.toSnakeCase(name);
      if (spec !== null && spec !== undefined) {
        if (typeof spec === "string") {
          dataEntries.push([`data-${snakeName}`, spec]);
        } else if (typeof spec === "boolean" && spec) {
          dataEntries.push([`data-${snakeName}`, "true"]);
        }
      }
    }
    let data = Object.fromEntries(dataEntries);
    return data;
  }

}