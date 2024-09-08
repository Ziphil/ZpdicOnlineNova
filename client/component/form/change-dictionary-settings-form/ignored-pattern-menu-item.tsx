/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useTrans} from "zographia";
import {create} from "/client/component/create";


export const IgnoredPatternMenuItem = create(
  require("./ignored-pattern-menu-item.scss"), "IgnoredPatternMenuItem",
  function ({
    name,
    pattern
  }: {
    name: string,
    pattern: string
  }): ReactElement {

    const {trans} = useTrans("changeDictionarySettingsForm");

    return (
      <div styleName="root">
        <div>{trans(`pattern.${name}`)}</div>
        <div styleName="small">{pattern}</div>
      </div>
    );

  }
);