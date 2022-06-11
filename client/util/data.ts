//


export class DataUtil {

  private static toSnakeCase(string: string): string {
    return string.replace(/([A-Z])/g, (char) => "-" + char.toLowerCase());
  }

  public static create(object: Record<string, string | boolean | null | undefined>): Record<`data-${string}`, string> {
    const dataEntries = [];
    for (const [name, spec] of Object.entries(object)) {
      const snakeName = DataUtil.toSnakeCase(name);
      if (spec !== null && spec !== undefined) {
        if (typeof spec === "string") {
          dataEntries.push([`data-${snakeName}`, spec]);
        } else if (typeof spec === "boolean" && spec) {
          dataEntries.push([`data-${snakeName}`, "true"]);
        }
      }
    }
    const data = Object.fromEntries(dataEntries);
    return data;
  }

}