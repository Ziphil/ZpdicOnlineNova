//


export class RegexpUtil {

  public static exec(pattern: string | RegExp, target: string): RegexpExecResult {
    const regexp = new RegExp(pattern, "g");
    let captures;
    const matches = [];
    while ((captures = regexp.exec(target)) !== null) {
      const start = captures.index;
      const end = regexp.lastIndex;
      const range = {start, end};
      const match = {range, captures};
      matches.push(match);
    }
    const result = {target, matches};
    return result;
  }

}


export type RegexpExecResult = {target: string, matches: Array<RegexpExecMatch>};
export type RegexpExecMatch = {range: RegexpExecRange, captures: Array<string>};
export type RegexpExecRange = {start: number, end: number};