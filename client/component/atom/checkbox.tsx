//

import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import * as react from "react";
import {
  ChangeEvent,
  ReactElement,
  useCallback
} from "react";
import {
  StylesRecord,
  create
} from "/client/component/create";


const Checkbox = create(
  require("./checkbox.scss"), "Checkbox",
  function ({
    name,
    value,
    label,
    checked,
    onSet,
    onChange,
    className,
    styles
  }: {
    name: string,
    value: string,
    label: string,
    checked: boolean,
    onSet?: (checked: boolean) => void,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    className?: string,
    styles?: StylesRecord
  }): ReactElement {

    let handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      onSet?.(event.target.checked);
      onChange?.(event);
    }, [onSet, onChange]);

    let node = (
      <label styleName="root" className={className}>
        <input styleName="original" type="checkbox" name={name} value={value} checked={checked} onChange={handleChange}/>
        <div styleName="box">
          <FontAwesomeIcon className={styles!["icon"]} icon="check"/>
        </div>
        <span styleName="label">{label}</span>
      </label>
    );
    return node;

  }
);


export default Checkbox;