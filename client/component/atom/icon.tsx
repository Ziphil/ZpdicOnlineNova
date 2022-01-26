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
    className
  }: {
    name: IconName,
    flip?: "horizontal" | "vertical" | "both" | undefined,
    spin?: boolean,
    pulse?: boolean,
    className?: string
  }): ReactElement {

    let node = (
      <FontAwesomeIcon className={className} icon={name} flip={flip} spin={spin} pulse={pulse}/>
    );
    return node;

  }
);


export type IconName = FontAwesomeIconName;

export default Icon;