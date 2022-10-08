//

import {
  ModifierArguments,
  Placement,
  VirtualElement
} from "@popperjs/core";
import * as react from "react";
import {
  ComponentProps,
  FocusEvent,
  MouseEvent,
  ReactElement,
  createContext,
  useCallback,
  useMemo,
  useState
} from "react";
import {
  usePopper
} from "react-popper";
import type DropdownItem from "/client/component/atom/dropdown-item";
import {
  create
} from "/client/component/create";
import {
  DataUtil
} from "/client/util/data";


type DropdownContextValue = {
  onSet?: (value: any) => void
};
export const dropdownContext = createContext<DropdownContextValue>({
});


export const Dropdown = create(
  require("./dropdown-beta.scss"), "Dropdown",
  function <V extends {}>({
    referenceElement,
    open = false,
    placement = "bottom",
    autoMode = "focus",
    showArrow = false,
    fillWidth = false,
    restrictHeight = false,
    onClose,
    onSet,
    className,
    children
  }: {
    referenceElement: Element | VirtualElement | null,
    open?: boolean,
    placement?: Placement,
    autoMode?: "focus" | "click" | null,
    showArrow?: boolean,
    fillWidth?: boolean,
    restrictHeight?: boolean,
    onClose?: (event?: FocusEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => void,
    onSet?: (value: V) => void,
    className?: string,
    children?: Array<ReactElement<ComponentProps<typeof DropdownItem>>>
  }): ReactElement {

    const [currentOpen, setCurrentOpen] = useState(false);
    const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null);
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
    const {styles, attributes} = usePopper(referenceElement, popupElement, {
      placement,
      modifiers: [
        {name: "offset", options: {offset: [0, 8]}},
        {name: "flip", options: {altBoundary: true}},
        {name: "fillWidth", phase: "beforeWrite", requires: ["computeStyles"], fn: setFillWidth, enabled: fillWidth},
        {name: "arrow", options: {padding: 4, element: arrowElement}, enabled: showArrow}
      ]
    });

    const handleMouseDown = useCallback(function (value: V, event: MouseEvent<HTMLDivElement>): void {
      onSet?.(value);
      if (autoMode === "click") {
        setCurrentOpen(false);
        onClose?.(event);
      }
    }, [autoMode, onClose, onSet, setCurrentOpen]);

    const handleClick = useCallback(function (event: MouseEvent<HTMLDivElement>): void {
      if (autoMode === "click") {
        setCurrentOpen(true);
      }
    }, [autoMode, setCurrentOpen]);

    const handleClickOutside = useCallback(function (): void {
      if (autoMode === "click") {
        setCurrentOpen(false);
        onClose?.();
      }
    }, [autoMode, onClose, setCurrentOpen]);

    const handleFocus = useCallback(function (event: FocusEvent<HTMLDivElement>): void {
      if (autoMode === "focus") {
        setCurrentOpen(true);
      }
    }, [autoMode, setCurrentOpen]);

    const handleBlur = useCallback(function (event: FocusEvent<HTMLDivElement>): void {
      if (autoMode === "focus") {
        setCurrentOpen(false);
        onClose?.(event);
      }
    }, [autoMode, onClose, setCurrentOpen]);

    const ContextProvider = dropdownContext["Provider"];
    const contextValue = useMemo(() => ({onSet}), [onSet]);
    const data = DataUtil.create({
      hidden: !open,
      showArrow,
      restrictHeight
    });
    const node = (
      <div styleName="suggestion" className={className} ref={setPopupElement} style={styles.popper} {...attributes.popper} {...data}>
        <div styleName="arrow" ref={setArrowElement} style={styles.arrow} {...attributes.arrow}/>
        <ContextProvider value={contextValue}>
          {children}
        </ContextProvider>
      </div>
    );
    return node;

  }
);


function setFillWidth({state}: ModifierArguments<{}>): void {
  state.styles.popper.width = `${state.rects.reference.width}px`;
}


export default Dropdown;