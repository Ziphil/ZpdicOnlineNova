//


export function sendAnalyticsEvent(name: string, params: Iterable<readonly [string, string]>): void {
  const debug = location.hostname === "localhost";
  if (!debug) {
    const actualParams = Object.fromEntries(params);
    console.log("ga event", name, actualParams);
    if (typeof gtag !== "undefined") {
      gtag("event", name, actualParams);
    }
  }
}

export function setAnalyticsProperties(id: string, config: Iterable<readonly [string, string]>): void {
  const debug = location.hostname === "localhost";
  if (!debug) {
    const actualConfig = Object.fromEntries(config);
    console.log("ga set", id, actualConfig);
    if (typeof gtag !== "undefined") {
      gtag("set", id, actualConfig);
    }
  }
}
