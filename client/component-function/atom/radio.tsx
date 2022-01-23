//

import * as react from "react";
import {
  ChangeEvent,
  ReactElement,
  useCallback
} from "react";
import {
  create
} from "/client/component-function/create";


const Radio = create(
  require("./radio.scss"), "Radio",
  function ({
    name,
    value,
    label,
    checked,
    onChange,
    className
  }: {
    name: string,
    value: string,
    label: string,
    checked: boolean,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    className?: string
  }): ReactElement {

    let handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      onChange?.(event);
    }, [onChange]);

    let node = (
      <label styleName="root" className={className}>
        <input styleName="radio" type="radio" name={name} value={value} checked={checked} onChange={handleChange}/>
        <span styleName="label">{label}</span>
      </label>
    );
    return node;

  }
);


export default Radio;