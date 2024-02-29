//

import {ReactElement} from "react";
import {CheckableContainer, CheckableLabel, Radio, RadioGroup, Select, SelectOption, useResponsiveDevice, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {WordType} from "/client-new/skeleton";


export const WordTypeSelect = create(
  require("./word-type-select.scss"), "WordTypeSelect",
  function <T extends WordType>({
    type,
    optionTypes,
    kind,
    onSet,
    ...rest
  }: {
    type: T,
    optionTypes: ReadonlyArray<T>,
    kind: "radio" | "select" | "flexible",
    onSet: (type: T) => void,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("wordTypeSelect");

    const device = useResponsiveDevice();
    const resolvedKind = (kind === "flexible") ? (device === "mobile" ? "select" : "radio") : kind;

    return (resolvedKind === "radio") ? (
      <div styleName="root-radio" {...rest}>
        <RadioGroup value={type} onSet={onSet as any}>
          {optionTypes.map((optionType) => (
            <CheckableContainer key={optionType}>
              <Radio value={optionType}/>
              <CheckableLabel>{trans(`label.${optionType}`)}</CheckableLabel>
            </CheckableContainer>
          ))}
        </RadioGroup>
      </div>
    ) : (
      <Select styleName="root-select" value={type} onSet={onSet} {...rest}>
        {optionTypes.map((optionType) => (
          <SelectOption key={optionType} value={optionType} label={trans(`label.${optionType}`)}>{trans(`label.${optionType}`)}</SelectOption>
        ))}
      </Select>
    );

  }
);