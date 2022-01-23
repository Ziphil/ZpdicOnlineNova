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


const Checkbox = create(
  require("./checkbox.scss"), "Checkbox",
  function ({
    name,
    value,
    label,
    checked,
    onSet,
    onChange,
    className
  }: {
    name: string,
    value: string,
    label: string,
    checked: boolean,
    onSet?: (checked: boolean) => void,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    className?: string
  }): ReactElement {

    let handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      onSet?.(event.target.checked);
      onChange?.(event);
    }, [onSet, onChange]);

    let node = (
      <label styleName="root" className={className}>
        <input styleName="checkbox" type="checkbox" name={name} value={value} checked={checked} onChange={handleChange}/>
        <span styleName="label">{label}</span>
      </label>
    );
    return node;

  }
);


export default Checkbox;