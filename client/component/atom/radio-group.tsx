//

import * as react from "react";
import {
  ChangeEvent,
  ReactElement,
  useCallback
} from "react";
import Radio from "/client/component/atom/radio";
import {
  create
} from "/client/component/create";


const RadioGroup = create(
  require("./radio-group.scss"), "RadioGroup",
  function <V extends string>({
    value,
    name,
    specs,
    onChange,
    onSet,
    className
  }: {
    value: V | null,
    name: string,
    specs: ArrayLike<{value: V, label: string}>,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    onSet?: (value: V) => void,
    className?: string
  }): ReactElement {

    let handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      let value = event.target.value as V;
      onChange?.(event);
      onSet?.(value);
    }, [onChange, onSet]);

    let node = (
      <div styleName="root" className={className}>
        {Array.from(specs).map((spec, index) => (
          <Radio name={name} value={spec.value} label={spec.label} checked={spec.value === value} onChange={handleChange} key={index}/>
        ))}
      </div>
    );
    return node;

  }
);


export default RadioGroup;