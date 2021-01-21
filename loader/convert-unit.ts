//

import * as cssTree from "css-tree";
import {
  Dimension
} from "css-tree";
import {
  getOptions
} from "loader-utils";


function convert(this: any, source: string) {
  let options = getOptions(this);
  let tree = cssTree.parse(source);
  cssTree.walk(tree, (node) => {
    if (node.type === "Dimension") {
      let convertResult = convertUnit(node);
      if (convertResult !== null) {
        node.value = convertResult.value.toString();
        node.unit = convertResult.unit;
      }
    }
  });
  let result = cssTree.generate(tree);
  return result;
}

function convertUnit(dimension: Dimension): {value: number, unit: string} | null {
  if (dimension.unit === "u") {
    let value = parseFloat(dimension.value) / 48;
    let unit = "rem";
    return {value, unit};
  } else if (dimension.unit === "rpx") {
    let value = parseFloat(dimension.value) / 16;
    let unit = "rem";
    return {value, unit};
  } else {
    return null;
  }
}

export default convert;