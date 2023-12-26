//

import * as cssTree from "css-tree";
import type {Dimension} from "css-tree";


function convert(this: any, source: string): string {
  const options = this.getOptions();
  const tree = cssTree.parse(source);
  cssTree.walk(tree, (node) => {
    if (node.type === "Dimension") {
      const convertResult = convertUnit(node);
      if (convertResult !== null) {
        node.value = convertResult.value.toString();
        node.unit = convertResult.unit;
      }
    }
  });
  const result = cssTree.generate(tree);
  return result;
}

function convertUnit(dimension: Dimension): {value: number, unit: string} | null {
  if (dimension.unit === "zu") {
    const value = parseFloat(dimension.value) * 4 / 16;
    const unit = "rem";
    return {value, unit};
  } else if (dimension.unit === "zx") {
    const value = parseFloat(dimension.value) * 1 / 16;
    const unit = "rem";
    return {value, unit};
  } else {
    return null;
  }
}

export default convert;