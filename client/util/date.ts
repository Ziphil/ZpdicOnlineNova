//


export class DateUtil {

  public static format(date: Date | number | string, format: string, locale?: string): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    let result = format;
    result = result.replace(/yyyy/g, this.padZero(date.getFullYear(), 4));
    result = result.replace(/yy/g, this.padZero(date.getFullYear() % 100, 2));
    result = result.replace(/MM/g, this.padZero(date.getMonth() + 1, 2));
    result = result.replace(/M/g, this.padZero(date.getMonth() + 1, 1));
    result = result.replace(/dd/g, this.padZero(date.getDate(), 2));
    result = result.replace(/d/g, this.padZero(date.getDate(), 1));
    result = result.replace(/HH/g, this.padZero(date.getHours(), 2));
    result = result.replace(/H/g, this.padZero(date.getHours(), 1));
    result = result.replace(/mm/g, this.padZero(date.getMinutes(), 2));
    result = result.replace(/m/g, this.padZero(date.getMinutes(), 1));
    result = result.replace(/ss/g, this.padZero(date.getSeconds(), 2));
    result = result.replace(/s/g, this.padZero(date.getSeconds(), 1));
    result = result.replace(/LLLL/g, date.toLocaleString(locale, {month: "long"}));
    result = result.replace(/LLL/g, date.toLocaleString(locale, {month: "short"}));
    return result;
  }

  private static padZero(number: number | string, length: number): string {
    let preceding = new Array(length).join("0");
    let result = (preceding + number).slice(-length);
    return result;
  }

}