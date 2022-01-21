//

import * as react from "react";
import {
  FocusEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useState
} from "react";
import {
  create
} from "/client/component-function/create";
import {
  StyleNameUtil
} from "/client/util/style-name";


let Dropdown = create(
  require("./dropdown.scss"), "Dropdown",
  function <V>({
    specs,
    open = false,
    autoMode = "focus",
    showArrow = false,
    fillWidth = true,
    restrictHeight = true,
    onClick,
    onOpen,
    onClose,
    onSet,
    className,
    children
  }: {
    specs: ArrayLike<DropdownSpec<V>>,
    open?: boolean,
    autoMode?: "focus" | "click" | null,
    showArrow?: boolean,
    fillWidth?: boolean,
    restrictHeight?: boolean,
    onClick?: (event: MouseEvent<HTMLDivElement>) => void,
    onOpen?: (event: FocusEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => void,
    onClose?: (event: FocusEvent<HTMLDivElement> | MouseEvent<unknown>) => void,
    onSet?: (value: V) => void,
    className?: string,
    children?: ReactNode
  }): ReactElement {

    let [currentOpen, setCurrentOpen] = useState(false);

    let handleMouseDown = useCallback(function (value: V, event: MouseEvent<HTMLDivElement>): void {
      onClick?.(event);
      onSet?.(value);
      if (autoMode === "click") {
        setCurrentOpen(false);
        onClose?.(event);
      }
    }, [autoMode, onClick, onClose, onSet, setCurrentOpen]);

    let handleClick = useCallback(function (event: MouseEvent<HTMLDivElement>): void {
      if (autoMode === "click") {
        setCurrentOpen(true);
        onOpen?.(event);
      }
    }, [autoMode, onOpen, setCurrentOpen]);

    let handleClickOutside = useCallback(function (event: MouseEvent<unknown>): void {
      if (autoMode === "click") {
        setCurrentOpen(false);
        onClose?.(event);
      }
    }, [autoMode, onClose, setCurrentOpen]);

    let handleFocus = useCallback(function (event: FocusEvent<HTMLDivElement>): void {
      if (autoMode === "focus") {
        setCurrentOpen(true);
        onOpen?.(event);
      }
    }, [autoMode, onOpen, setCurrentOpen]);

    let handleBlur = useCallback(function (event: FocusEvent<HTMLDivElement>): void {
      if (autoMode === "focus") {
        setCurrentOpen(false);
        onClose?.(event);
      }
    }, [autoMode, onClose, setCurrentOpen]);

    let actualOpen = (autoMode !== null) ? currentOpen : open;
    let styleName = StyleNameUtil.create(
      "suggestion",
      {if: showArrow, true: "arrow"},
      {if: fillWidth, true: "fill-width"},
      {if: restrictHeight, true: "restrict-height"}
    );
    let itemNodes = Array.from(specs).map((spec, index) => {
      let itemNode = (
        <div styleName="suggestion-item" key={index} tabIndex={0} onMouseDown={(event) => handleMouseDown(spec.value, event)}>
          {spec.node}
        </div>
      );
      return itemNode;
    });
    let suggestionNode = (actualOpen && specs.length > 0) && (
      <div styleName={styleName}>
        {itemNodes}
      </div>
    );
    let node = (
      <div styleName="root" className={className}>
        <div onClick={handleClick} onFocus={handleFocus} onBlur={handleBlur}>
          {children}
        </div>
        {suggestionNode}
      </div>
    );
    return node;

  }
);


export type DropdownSpec<V> = {value: V, node: ReactNode};

export default Dropdown;