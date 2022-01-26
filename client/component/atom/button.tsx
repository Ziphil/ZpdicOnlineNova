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
  StyleNameUtil
} from "/client/util/style-name";


const Button = create(
  require("./button.scss"), "Button",
  function ({
    label,
    iconName,
    iconLabel,
    position = "alone",
    style = "normal",
    hideLabel = false,
    reactive = false,
    disabled = false,
    onClick,
    className,
    styles
  }: {
    label?: string,
    iconName?: IconName,
    iconLabel?: string,
    position?: "alone" | "left" | "right" | "middle",
    style?: "normal" | "caution" | "information" | "simple" | "link",
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

    let styleName = StyleNameUtil.create(
      "root",
      {if: label === undefined, true: "only-icon"},
      {if: position !== "alone", true: position},
      {if: style === "simple" || style === "link", true: "simple", false: "button"},
      {if: style === "link", true: "link"},
      {if: style === "caution", true: "caution"},
      {if: style === "information", true: "information"},
      {if: hideLabel, true: "hide-label"},
      {if: loading, true: "loading"}
    );
    let labelNode = (label !== undefined) && <span styleName="label">{label}</span>;
    let iconNode = (iconName !== undefined) ? <Icon className={styles!["icon"]} name={iconName}/> : (iconLabel !== undefined) && <span styleName="icon">{iconLabel}</span>;
    let spinnerNode = (reactive) && (
      <span styleName="spinner-wrapper">
        <Icon name="spinner" pulse={true}/>
      </span>
    );
    let node = (
      <button styleName={styleName} className={className} disabled={disabled || loading} onClick={handleClick}>
        {iconNode}
        {labelNode}
        {spinnerNode}
      </button>
    );
    return node;

  }
);


export default Button;