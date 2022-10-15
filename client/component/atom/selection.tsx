//

import {
  ComponentProps,
  ReactElement,
  useState
} from "react";
import Dropdown from "/client/component/atom/dropdown";
import DropdownItem from "/client/component/atom/dropdown-item";
import Icon from "/client/component/atom/icon";
import Label from "/client/component/atom/label";
import {
  StylesRecord,
  create
} from "/client/component/create";


export const Selection = create(
  require("./selection.scss"), "Selection",
  function <V extends {}>({
    value,
    label,
    showRequired,
    showOptional,
    onSet,
    className,
    children
  }: {
    value: V,
    label?: string,
    showRequired?: boolean,
    showOptional?: boolean,
    onSet?: (value: V) => void,
    className?: string,
    children: Array<ReactElement<ComponentProps<typeof DropdownItem>>>
  }): ReactElement {

    const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);

    const node = (
      <div styleName="root" className={className}>
        <label styleName="label-container">
          <Label text={label} showRequired={showRequired} showOptional={showOptional}/>
          <SelectionSelection {...{value, setReferenceElement, children}}/>
        </label>
        <Dropdown fillWidth={true} restrictHeight={true} autoMode="focus" referenceElement={referenceElement} autoElement={referenceElement} onSet={onSet}>
          {children}
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
    setReferenceElement,
    children,
    styles
  }: {
    value: V,
    setReferenceElement: (referenceElement: HTMLButtonElement | null) => void,
    children: Array<ReactElement<ComponentProps<typeof DropdownItem>>>,
    styles?: StylesRecord
  }): ReactElement {

    const node = (
      <button styleName="selection" type="button" ref={setReferenceElement}>
        <div styleName="text">
          {children.find((element) => element.props.value === value)?.props.children}
        </div>
        <Icon className={styles!["arrow"]} name="angle-down"/>
      </button>
    );
    return node;

  }
);


export default Selection;