//

import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faBluesky, faDiscord, faXTwitter} from "@fortawesome/free-brands-svg-icons";
import {faGlobe, faLink} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, Select, SelectOption, useTrans} from "zographia";
import {create} from "/client/component/create";
import {USER_SOCIAL_TYPES, UserSocialType} from "/server/internal/skeleton";


/** 各リンク種別に対応するアイコン。
 * Font Awesome に専用のブランドアイコンがない種別 (misskey, note, migdal など) には、暫定的に汎用アイコンを割り当てている (後でカスタムアイコンに差し替える予定)。*/
const USER_SOCIAL_TYPE_ICONS = {
  website: faGlobe,
  x: faXTwitter,
  bluesky: faBluesky,
  misskey: faLink,
  note: faLink,
  migdal: faLink,
  discord: faDiscord,
  other: faLink
} satisfies Record<UserSocialType, IconDefinition>;


export const UserSocialTypeSelect = create(
  require("./user-social-type-select.scss"), "UserSocialTypeSelect",
  function ({
    type,
    optionTypes = USER_SOCIAL_TYPES,
    onSet,
    ...rest
  }: {
    type: UserSocialType,
    optionTypes?: ReadonlyArray<UserSocialType>,
    onSet?: (type: UserSocialType) => unknown,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userSocialTypeSelect");

    return (
      <Select styleName="root" value={type} onSet={onSet} {...rest}>
        {optionTypes.map((optionType) => (
          <SelectOption
            key={optionType}
            value={optionType}
            label={<span styleName="label"><GeneralIcon styleName="icon" icon={USER_SOCIAL_TYPE_ICONS[optionType]}/>{trans(`label.${optionType}`)}</span>}
          >
            <span styleName="label"><GeneralIcon styleName="icon" icon={USER_SOCIAL_TYPE_ICONS[optionType]}/>{trans(`label.${optionType}`)}</span>
          </SelectOption>
        ))}
      </Select>
    );

  }
);
