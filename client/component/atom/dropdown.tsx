//

import * as react from "react";
import {
  useRef
} from "react";
import {
  FocusEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useState
} from "react";
import {
  useClickAway
} from "react-use";
import {
  create
} from "/client/component/create";
import {
  DataUtil
} from "/client/util/data";


let Dropdown = create(
  require("./dropdown.scss"), "Dropdown",
  function <V>({
    specs,
    open = false,
    placement = "left",
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
    placement?: "left" | "right",
    autoMode?: "focus" | "click" | null,
    showArrow?: boolean,
    fillWidth?: boolean,
    restrictHeight?: boolean,
    onClick?: (event: MouseEvent<HTMLDivElement>) => void,
    onOpen?: (event: FocusEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => void,
    onClose?: (event?: FocusEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => void,
    onSet?: (value: V) => void,
    className?: string,
    children?: ReactNode
  }): ReactElement {

    let [currentOpen, setCurrentOpen] = useState(false);
    let suggestionRef = useRef<HTMLDivElement>(null);

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

    let handleClickOutside = useCallback(function (): void {
      if (autoMode === "click") {
        setCurrentOpen(false);
        onClose?.();
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

    useClickAway(suggestionRef, () => {
      handleClickOutside();
    });

    let actualOpen = (autoMode !== null) ? currentOpen : open;
    let data = DataUtil.create({
      placement,
      showArrow,
      fillWidth,
      restrictHeight
    });
    let node = (
      <div styleName="root" className={className}>
        <div onClick={handleClick} onFocus={handleFocus} onBlur={handleBlur}>
          {children}
        </div>
        {(actualOpen && specs.length > 0) && (
          <div styleName="suggestion" ref={suggestionRef} {...data}>
            <div styleName="arrow"/>
            {Array.from(specs).map((spec, index) => (
              <div styleName="suggestion-item" key={index} tabIndex={0} onMouseDown={(event) => handleMouseDown(spec.value, event)}>
                {spec.node}
              </div>
            ))}
          </div>
        )}
      </div>
    );
    return node;

  }
);


export type DropdownSpec<V> = {value: V, node: ReactNode};

export default Dropdown;