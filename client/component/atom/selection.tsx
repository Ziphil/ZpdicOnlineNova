//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import Dropdown from "/client/component/atom/dropdown";
import Icon from "/client/component/atom/icon";
import Label from "/client/component/atom/label";
import {
  StylesRecord,
  create
} from "/client/component/create";


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

    let node = (
      <div styleName="root" className={className}>
        <Dropdown specs={specs} onSet={onSet}>
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
    specs,
    styles
  }: {
    value: V,
    specs: ArrayLike<SelectionSpec<V>>,
    styles?: StylesRecord
  }): ReactElement {

    let innerNode = Array.from(specs).find((spec) => spec.value === value)!.node;
    let node = (
      <button styleName="selection">
        <div styleName="text">{innerNode}</div>
        <Icon className={styles!["arrow"]} name="angle-down"/>
      </button>
    );
    return node;

  }
);


export type SelectionSpec<V> = {value: V, node: ReactNode};

export default Selection;