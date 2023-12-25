//

import seedrandom from "seedrandom";


export class Random {

  private random: () => number;

  public constructor(seed: string) {
    this.random = seedrandom(seed);
  }

  public shuffle<T>(array: Array<T>): Array<T> {
    for (let i = array.length - 1 ; i > 0 ; i --) {
      const j = Math.floor(this.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}