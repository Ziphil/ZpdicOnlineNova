/* eslint-disable react/jsx-closing-bracket-location */

import {ComponentProps, ReactElement} from "react";
import {AdditionalProps, Input, useTrans} from "zographia";
import {createWithRef} from "/client/component/create";
import {IgnoredPatternMenuItem} from "/client/component/form/change-dictionary-settings-form/ignored-pattern-menu-item";


export const IgnoredPatternInput = createWithRef(
  null, "IgnoredPatternInput",
  function ({
    ...rest
  }: ComponentProps<typeof Input> & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionarySettingsForm");

    return (
      <Input {...rest} suggest={() => [{
        replacement: "",
        node: trans("pattern.none")
      }, {
        replacement: "[\\(（].*?[\\)）]",
        node: <IgnoredPatternMenuItem name="paren" pattern={"[\\(（].*?[\\)）]"}/>
      }]}/>
    );

  }
);