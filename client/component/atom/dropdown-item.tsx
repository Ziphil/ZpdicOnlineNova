//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useContext
} from "react";
import {
  dropdownContext
} from "/client/component/atom/dropdown-beta";
import {
  create
} from "/client/component/create";


export const DropdownItem = create(
  require("./dropdown-item.scss"), "DropdownItem",
  function <V extends {}>({
    value,
    className,
    children
  }: {
    value: V,
    className?: string,
    children?: ReactNode
  }): ReactElement {

    const contextValue = useContext(dropdownContext);

    const handleMouseDown = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      contextValue.onSet?.(value);
    }, [value, contextValue]);

    const node = (
      <button styleName="root" className={className} onMouseDown={handleMouseDown}>
        {children}
      </button>
    );
    return node;

  }
);


export default DropdownItem;