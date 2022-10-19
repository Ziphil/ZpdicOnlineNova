//

import {
  ModifierArguments,
  Placement,
  Instance as PopperInstance
} from "@popperjs/core";
import {
  ReactElement,
  Ref,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  usePopper
} from "react-popper";
import {
  useClickAway
} from "react-use";
import {
  create
} from "/client/component/create";
import {
  DataUtil
} from "/client/util/data";
import {
  fillRef
} from "/client/util/ref";


type DropdownContextValue = {
  onSet?: (value: any) => void
};
export const dropdownContext = createContext<DropdownContextValue>({});
export const DropdownContextProvider = dropdownContext["Provider"];


export const Dropdown = create(
  require("./dropdown.scss"), "Dropdown",
  function <V extends {}>({
    open = false,
    placement = "bottom-start",
    autoMode = null,
    showArrow = false,
    fillWidth = false,
    restrictHeight = false,
    referenceElement,
    autoElement,
    onSet,
    popperRef,
    className,
    children
  }: {
    open?: boolean,
    placement?: Placement,
    autoMode?: "focus" | "click" | null,
    showArrow?: boolean,
    fillWidth?: boolean,
    restrictHeight?: boolean,
    referenceElement: HTMLElement | null,
    autoElement?: HTMLElement | null,
    onSet?: (value: V) => void,
    popperRef?: Ref<DropdownPopperInstance>,
    className?: string,
    children: ReactElement | Array<ReactElement>
  }): ReactElement {

    const [currentOpen, setCurrentOpen] = useState(false);
    const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null);
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
    const openingRef = useRef(false);
    const {styles, attributes, ...popper} = usePopper(referenceElement, popupElement, {
      placement,
      modifiers: [
        {name: "offset", options: {offset: (showArrow) ? [0, 8] : [0, -1]}},
        {name: "flip", options: {altBoundary: true}},
        {name: "fillWidth", phase: "beforeWrite", requires: ["computeStyles"], fn: setFillWidth, enabled: fillWidth},
        {name: "arrow", options: {padding: 4, element: arrowElement}, enabled: showArrow}
      ]
    });

    const handleSet = useCallback(function (value: V): void {
      if (autoMode !== null) {
        setCurrentOpen(false);
      }
      onSet?.(value);
    }, [autoMode, onSet]);

    useEffect(() => {
      if (autoMode === "focus") {
        const handleFocus = function (): void {
          popper.update?.();
          setCurrentOpen(true);
        };
        const handleBlur = function (): void {
          setCurrentOpen(false);
        };
        autoElement?.addEventListener("focus", handleFocus);
        autoElement?.addEventListener("blur", handleBlur);
        return () => {
          autoElement?.removeEventListener("focus", handleFocus);
          autoElement?.removeEventListener("blur", handleBlur);
        };
      } else if (autoMode === "click") {
        const handleMouseDown = function (): void {
          openingRef.current = true;
          popper.update?.();
          setCurrentOpen(true);
        };
        autoElement?.addEventListener("mousedown", handleMouseDown);
        return () => {
          autoElement?.removeEventListener("mousedown", handleMouseDown);
        };
      } else {
        return () => null;
      }
    }, [autoMode, autoElement, popper]);

    useEffect(() => {
      if (popperRef !== undefined) {
        fillRef(popperRef, {update: popper.update, forceUpdate: popper.forceUpdate});
      }
    }, [popperRef, popper.update, popper.forceUpdate]);

    useClickAway({current: popupElement}, () => {
      if (autoMode === "click") {
        if (!openingRef.current) {
          setCurrentOpen(false);
        }
      }
      openingRef.current = false;
    });

    const contextValue = useMemo(() => ({onSet: handleSet}), [handleSet]);
    const arrayChildren = (Array.isArray(children)) ? children : [children];
    const actualOpen = arrayChildren.length > 0 && ((autoMode !== null) ? currentOpen : open);
    const data = DataUtil.create({
      hidden: !actualOpen,
      showArrow,
      restrictHeight
    });
    const node = (
      <div styleName="root" className={className} ref={setPopupElement} style={styles.popper} {...attributes.popper} {...data}>
        <div styleName="arrow" ref={setArrowElement} style={styles.arrow} {...attributes.arrow}/>
        <DropdownContextProvider value={contextValue}>
          {children}
        </DropdownContextProvider>
      </div>
    );
    return node;

  }
);


export type DropdownPopperInstance = Pick<PopperInstance, "update" | "forceUpdate">;

function setFillWidth({state}: ModifierArguments<{}>): void {
  state.styles.popper.width = `${state.rects.reference.width}px`;
}


export default Dropdown;