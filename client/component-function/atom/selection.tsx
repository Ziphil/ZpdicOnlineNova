//

import * as react from "react";
import {
  ReactElement
} from "react";
import Dropdown from "/client/component-function/atom/dropdown";
import Label from "/client/component-function/atom/label";
import {
  create
} from "/client/component-function/create";


const Selection = create(
  require("./selection.scss"), "Selection",
  function <V>({
    value,
    label,
    specs,
    showRequired,
    showOptional,
    onSet,
    className
  }: {
    value: V,
    label?: string,
    specs: ArrayLike<SelectionSpec<V>>,
    showRequired?: boolean,
    showOptional?: boolean,
    onSet?: (value: V) => void,
    className?: string
  }): ReactElement {

    let dropdownSpecs = Array.from(specs).map((spec) => ({value: spec.value, node: spec.text}));
    let node = (
      <div styleName="root" className={className}>
        <Dropdown specs={dropdownSpecs} onSet={onSet}>
          <label styleName="label-wrapper">
            <Label text={label} showRequired={showRequired} showOptional={showOptional}/>
            <SelectionSelection {...{value, specs}}/>
          </label>
        </Dropdown>
      </div>
    );
    return node;

  }
);


const SelectionSelection = create(
  require("./selection.scss"),
  function <V>({
    value,
    specs
  }: {
    value: V,
    specs: ArrayLike<SelectionSpec<V>>
  }): ReactElement {

    let text = Array.from(specs).find((spec) => spec.value === value)!.text;
    let node = (
      <button styleName="selection">
        <div styleName="text">{text}</div>
        <div styleName="arrow"/>
      </button>
    );
    return node;

  }
);


export type SelectionSpec<V> = {value: V, text: string};

export default Selection;