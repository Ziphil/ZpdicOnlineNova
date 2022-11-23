//

import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  ChangeEvent,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import {
  create
} from "/client/component/create";
import {
  aria
} from "/client/util/data";


export const Checkbox = create(
  require("./checkbox.scss"), "Checkbox",
  function ({
    name,
    value,
    label,
    checked,
    onSet,
    onChange,
    className,
    children
  }: {
    name: string,
    value: string,
    label?: string,
    checked: boolean,
    onSet?: (checked: boolean) => void,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    className?: string,
    children?: ReactNode
  }): ReactElement {

    const handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      onSet?.(event.target.checked);
      onChange?.(event);
    }, [onSet, onChange]);

    const node = (
      <label styleName="root" className={className}>
        <div styleName="original-wrapper">
          <input styleName="original" type="checkbox" name={name} value={value} checked={checked} onChange={handleChange}/>
          <div styleName="box" {...aria({hidden: true})}>
            <FontAwesomeIcon styleName="icon" icon="check"/>
          </div>
        </div>
        {(label !== undefined) && <span styleName="label">{label}</span>}
        {children}
      </label>
    );
    return node;

  }
);


export default Checkbox;