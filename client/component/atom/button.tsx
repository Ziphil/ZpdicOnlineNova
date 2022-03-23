//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback,
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
  DataUtil
} from "/client/util/data";


const Button = create(
  require("./button.scss"), "Button",
  function ({
    label,
    iconName,
    position = "alone",
    variant = "normal",
    hideLabel = false,
    reactive = false,
    disabled = false,
    onClick,
    className,
    styles
  }: {
    label?: string,
    iconName?: IconName,
    position?: "alone" | "left" | "right" | "middle",
    variant?: "normal" | "caution" | "information" | "simple" | "link",
    hideLabel?: boolean,
    reactive?: boolean,
    disabled?: boolean,
    onClick?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    className?: string,
    styles?: StylesRecord
  }): ReactElement {

    let [loading, setLoading] = useState(false);
    let [promise, setPromise] = useState<CancelablePromise<void> | null>(null);

    let handleClick = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      event.preventDefault();
      if (reactive) {
        setLoading(true);
        if (onClick) {
          let result = onClick(event);
          if (typeof result === "object" && typeof result.then === "function") {
            let nextPromise = new CancelablePromise(result);
            setPromise(nextPromise);
            nextPromise.then(() => {
              setLoading(false);
            }, (error) => {
            });
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } else {
        if (onClick) {
          onClick(event);
        }
      }
    }, [reactive, onClick]);

    useUnmount(() => {
      promise?.cancel();
    });

    let styleName = (variant === "simple" || variant === "link") ? "simple" : "button";
    let data = DataUtil.create({
      position: (position !== "alone") ? position : undefined,
      intent: (variant === "caution") ? "caution" : (variant === "information") ? "information" : undefined,
      onlyIcon: label === undefined,
      link: variant === "link",
      hideLabel,
      loading
    });
    let node = (
      <button styleName={styleName} className={className} disabled={disabled || loading} onClick={handleClick} {...data}>
        {(iconName !== undefined) && <Icon className={styles!["icon"]} name={iconName}/>}
        {(label !== undefined) && <span styleName="label">{label}</span>}
        {(reactive) && (
          <span styleName="spinner-wrapper">
            <Icon name="spinner" pulse={true}/>
          </span>
        )}
      </button>
    );
    return node;

  }
);


export default Button;