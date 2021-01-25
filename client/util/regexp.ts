//


export class RegexpUtil {

  public static exec(pattern: string | RegExp, target: string): RegexpExecResult {
    let regexp = new RegExp(pattern, "g");
    let captures;
    let matches = [];
    while ((captures = regexp.exec(target)) !== null) {
      let start = captures.index;
      let end = regexp.lastIndex;
      let range = {start, end};
      let match = {range, captures};
      matches.push(match);
    }
    let result = {target, matches};
    return result;
  }

}


export type RegexpExecResult = {target: string, matches: Array<RegexpExecMatch>};
export type RegexpExecMatch = {range: RegexpExecRange, captures: Array<string>};
export type RegexpExecRange = {start: number, end: number};