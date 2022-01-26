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

    let radioNodes = Array.from(specs).map((spec, index) => {
      let checked = spec.value === value;
      return <Radio name={name} value={spec.value} label={spec.label} checked={checked} onChange={handleChange} key={index}/>;
    });
    let node = (
      <div styleName="root" className={className}>
        {radioNodes}
      </div>
    );
    return node;

  }
);


export default RadioGroup;