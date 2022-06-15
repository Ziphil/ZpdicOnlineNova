//


export class GtagUtil {

  public static event(name: string, params: Iterable<readonly [string, string]>) {
    const actualParams = Object.fromEntries(params);
    console.log("ga event", name, actualParams);
    if (typeof gtag !== "undefined") {
      gtag("event", name, actualParams);
    }
  }

  public static set(id: string, config: Iterable<readonly [string, string]>) {
    const actualConfig = Object.fromEntries(config);
    console.log("ga set", id, actualConfig);
    if (typeof gtag !== "undefined") {
      gtag("set", id, actualConfig);
    }
  }

}