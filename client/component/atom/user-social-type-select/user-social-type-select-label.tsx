//

import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {getSocialIconColor, getSocialIconDefinition} from "/client/util/social";
import {UserSocialType} from "/server/internal/skeleton";


export const UserSocialTypeSelectLabel = create(
  require("./user-social-type-select-label.scss"), "UserSocialTypeSelectLabel",
  function ({
    type,
    ...rest
  }: {
    type: UserSocialType,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userSocialTypeSelect");

    return (
      <span styleName="root" {...rest}>
        <GeneralIcon styleName="icon" icon={getSocialIconDefinition(type)} style={{color: getSocialIconColor(type)}}/>
        {trans(`label.${type}`)}
      </span>
    );

  }
);
