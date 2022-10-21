//

import {
  MouseEvent,
  ReactElement,
  Ref,
  useCallback,
  useRef,
  useState
} from "react";
import {
  useUnmount
} from "react-use";
import {
  AsyncOrSync
} from "ts-essentials";
import Icon from "/client/component/atom/icon";
import {
  IconName
} from "/client/component/atom/icon";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  CancelablePromise
} from "/client/util/cancelable";
import {
  data
} from "/client/util/data";


export const Button = create(
  require("./button.scss"), "Button",
  function ({
    name,
    label,
    iconName,
    type,
    position = "alone",
    variant = "normal",
    scheme = "primary",
    hideLabel = false,
    reactive = false,
    disabled = false,
    onClick,
    className,
    styles,
    nativeRef
  }: {
    name?: string,
    label?: string,
    iconName?: IconName,
    type?: "button" | "submit" | "reset",
    position?: "alone" | "left" | "right" | "middle",
    variant?: "normal" | "light" | "link" | "simple",
    scheme?: "primary" | "red" | "blue",
    hideLabel?: boolean,
    reactive?: boolean,
    disabled?: boolean,
    onClick?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    className?: string,
    styles?: StylesRecord,
    nativeRef?: Ref<HTMLButtonElement>
  }): ReactElement {

    const [loading, setLoading] = useState(false);
    const promiseRef = useRef<CancelablePromise<void> | null>(null);

    const handleClick = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      event.preventDefault();
      if (reactive) {
        setLoading(true);
        if (onClick) {
          const result = onClick(event);
          if (typeof result === "object" && typeof result.then === "function") {
            const promise = new CancelablePromise(result);
            promiseRef.current = promise;
            promise.then(() => setLoading(false)).catch(() => null);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } else {
        onClick?.(event);
      }
    }, [reactive, onClick]);

    useUnmount(() => {
      promiseRef.current?.cancel();
    });

    const styleName = (variant === "simple" || variant === "link") ? "simple" : "button";
    const node = (
      <button
        styleName={styleName}
        className={className}
        name={name}
        type={type}
        disabled={disabled || loading}
        ref={nativeRef}
        onClick={handleClick}
        {...data({
          position: (position !== "alone") ? position : undefined,
          variant,
          scheme,
          onlyIcon: label === undefined,
          link: variant === "link",
          hideLabel,
          loading
        })}
      >
        {(iconName !== undefined) && <Icon className={styles!["icon"]} name={iconName}/>}
        {(label !== undefined) && <span styleName="label">{label}</span>}
        {(reactive) && (
          <span styleName="spinner-wrapper">
            <Icon name="circle-notch" spin={true}/>
          </span>
        )}
      </button>
    );
    return node;

  }
);


export default Button;