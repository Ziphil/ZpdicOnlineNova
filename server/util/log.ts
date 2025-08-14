//


export namespace LogUtil {

  export function log(place: string, object: any): void {
    const objectString = (typeof object === "string") ? object : JSON.stringify(object);
    const message = `!<${place}> ${objectString}`;
    console.log(message);
  }

  export function error(place: string, object: any, error: Error): void {
    const objectString = (typeof object === "string") ? object : JSON.stringify(object);
    const message = `!!<${place}> {"info": ${objectString}, "message": ${JSON.stringify(error.message)}, "stack": ${JSON.stringify(error.stack)}}`;
    console.error(message);
  }

}