//

import {
  ModifierArguments,
  Placement
} from "@popperjs/core";
import {
  ReactElement,
  ReactNode,
  useEffect,
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
  data
} from "/client/util/data";


export const Tooltip = create(
  require("./tooltip.scss"), "Tooltip",
  function ({
    open = false,
    placement = "bottom-start",
    scheme = "primary",
    autoMode = null,
    showArrow = false,
    fillWidth = false,
    referenceElement,
    autoElement,
    className,
    children
  }: {
    open?: boolean,
    placement?: Placement,
    scheme?: "primary" | "red" | "blue",
    autoMode?: "focus" | "hover" | "click" | null,
    showArrow?: boolean,
    fillWidth?: boolean,
    referenceElement: HTMLElement | null,
    autoElement?: HTMLElement | null,
    className?: string,
    children?: ReactNode
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
      } else if (autoMode === "hover") {
        const handleMouseEnter = function (): void {
          popper.update?.();
          setCurrentOpen(true);
        };
        const handleMouseLeave = function (): void {
          setCurrentOpen(false);
        };
        autoElement?.addEventListener("mouseenter", handleMouseEnter);
        autoElement?.addEventListener("mouseleave", handleMouseLeave);
        return () => {
          autoElement?.removeEventListener("mouseenter", handleMouseEnter);
          autoElement?.removeEventListener("mouseleave", handleMouseLeave);
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

    useClickAway({current: popupElement}, () => {
      if (autoMode === "click") {
        if (!openingRef.current) {
          setCurrentOpen(false);
        }
      }
      openingRef.current = false;
    });

    const actualOpen = children && ((autoMode !== null) ? currentOpen : open);
    const node = (
      <div
        styleName="root"
        className={className}
        ref={setPopupElement}
        style={styles.popper}
        {...attributes.popper}
        {...data({
          scheme,
          hidden: !actualOpen,
          showArrow
        })}
      >
        <div
          styleName="arrow"
          ref={setArrowElement}
          style={styles.arrow}
          {...attributes.arrow}
        />
        <p styleName="text">
          {children}
        </p>
      </div>
    );
    return node;

  }
);


function setFillWidth({state}: ModifierArguments<{}>): void {
  state.styles.popper.width = `${state.rects.reference.width}px`;
}


export default Tooltip;