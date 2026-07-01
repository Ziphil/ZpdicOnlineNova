//

import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {getSocialIconColor, getSocialIconDefinition} from "/client/util/social";
import {UserSocial, UserSocialTypeUtil} from "/server/internal/skeleton";


export const UserHeaderSocialList = create(
  require("./user-header-social-list.scss"), "UserHeaderSocialList",
  function ({
    socials,
    ...rest
  }: {
    socials: Array<UserSocial>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userHeader");

    return (
      <ul styleName="root" {...rest}>
        {socials.map((social, index) => (
          <li styleName="item" key={index}>
            <a styleName="link" href={social.url} target="_blank" rel="noopener noreferrer" title={trans(`social.${social.type}`)}>
              <GeneralIcon icon={getSocialIconDefinition(UserSocialTypeUtil.cast(social.type))} style={{color: getSocialIconColor(UserSocialTypeUtil.cast(social.type))}}/>
            </a>
          </li>
        ))}
      </ul>
    );

  }
);
