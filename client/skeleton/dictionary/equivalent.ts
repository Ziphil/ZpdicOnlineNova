//


export class Equivalent {

  public titles!: Array<string>;
  public names!: Array<string>;

  public static createEmpty(): Equivalent {
    const titles = [] as Array<string>;
    const names = [] as Array<string>;
    const skeleton = {titles, names};
    return skeleton;
  }

}