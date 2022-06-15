//


export class GtagUtil {

  public static event(name: string, params: Iterable<readonly [string, string]>) {
    console.log("ga event send", name);
    gtag("event", name, Object.fromEntries(params));
  }

}