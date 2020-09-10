//


export class LogUtil {

  public static log(place: string, object: any): void {
    let objectString = (typeof object === "string") ? object : JSON.stringify(object);
    let message = `[${place}] ${objectString}`;
    console.log(message);
  }

  public static error(place: string, object: any, error: Error): void {
    let objectString = (typeof object === "string") ? object : JSON.stringify(object);
    let message = `[${place}] ${objectString}`;
    console.error(message);
    console.error(error);
  }

}