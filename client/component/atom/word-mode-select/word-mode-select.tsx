//

import {ReactElement} from "react";
import {CheckableContainer, CheckableLabel, Radio, RadioGroup, Select, SelectOption, useResponsiveDevice, useTrans} from "zographia";
import {create} from "/client/component/create";
import {WordMode} from "/server/internal/skeleton";


export const WordModeSelect = create(
  require("./word-mode-select.scss"), "WordModeSelect",
  function <M extends WordMode>({
    mode,
    optionModes,
    kind,
    onSet,
    ...rest
  }: {
    mode: M,
    optionModes: ReadonlyArray<M>,
    kind: "radio" | "select" | "flexible",
    onSet: (mode: M) => void,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("wordModeSelect");

    const device = useResponsiveDevice();
    const resolvedKind = (kind === "flexible") ? (device === "mobile" ? "select" : "radio") : kind;

    return (resolvedKind === "radio") ? (
      <div styleName="root-radio" {...rest}>
        <RadioGroup value={mode} onSet={onSet as any}>
          {optionModes.map((optionMode) => (
            <CheckableContainer key={optionMode}>
              <Radio value={optionMode}/>
              <CheckableLabel>{trans(`label.${optionMode}`)}</CheckableLabel>
            </CheckableContainer>
          ))}
        </RadioGroup>
      </div>
    ) : (
      <Select styleName="root-select" value={mode} onSet={onSet} {...rest}>
        {optionModes.map((optionMode) => (
          <SelectOption key={optionMode} value={optionMode} label={trans(`label.${optionMode}`)}>{trans(`label.${optionMode}`)}</SelectOption>
        ))}
      </Select>
    );

  }
);