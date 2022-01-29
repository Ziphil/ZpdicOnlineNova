//

import {
  IconName as FontAwesomeIconName
} from "@fortawesome/fontawesome-common-types";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import * as react from "react";
import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";


const Icon = create(
  require("./icon.scss"), "Icon",
  function ({
    name,
    flip = undefined,
    spin,
    pulse,
    slashed = false,
    className
  }: {
    name: IconName,
    flip?: "horizontal" | "vertical" | "both" | undefined,
    spin?: boolean,
    pulse?: boolean,
    slashed?: boolean
    className?: string
  }): ReactElement {

    let fullName = (name === "github") ? ["fa-brands", "fa-github"] : name as any;
    if (slashed) {
      let node = (
        <span styleName="root stack" className={className}>
          <FontAwesomeIcon icon="slash" transform="down-2 left-2" mask={fullName} fixedWidth={true}/>
          <FontAwesomeIcon icon="slash"/>
        </span>
      );
      return node;
    } else {
      let node = (
        <span styleName="root" className={className}>
          <FontAwesomeIcon icon={fullName} flip={flip} spin={spin} pulse={pulse}/>
        </span>
      );
      return node;
    }

  }
);


export type IconName = string;

export default Icon;