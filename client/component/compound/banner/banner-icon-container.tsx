//

import {IconDefinition} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon} from "zographia";
import {create} from "/client/component/create";


export const BannerIconContainer = create(
  require("./banner.scss"), "BannerIconContainer",
  function ({
    icon,
    ...rest
  }: {
    icon: IconDefinition,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <GeneralIcon styleName="icon" icon={icon} {...rest}/>
    );

  }
);
