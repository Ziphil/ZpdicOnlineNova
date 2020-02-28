//

import * as css from "react-css-modules";


export function applyStyle(component: any): ClassDecorator {
  let options = {allowMultiple: true, handleNotFoundStyleName: "ignore"};
  let decorator = css(component, options);
  return decorator;
}