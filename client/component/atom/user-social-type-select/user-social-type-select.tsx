//

import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, Select, SelectOption, useTrans} from "zographia";
import {create} from "/client/component/create";
import {USER_SOCIAL_TYPES, USER_SOCIAL_TYPE_ICONS, UserSocialType} from "/client/constant/user-social";


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
        {optionTypes.map((optionType) => {
          const labelNode = (
            <span styleName="label">
              <GeneralIcon styleName="icon" icon={USER_SOCIAL_TYPE_ICONS[optionType]}/>
              {trans(`label.${optionType}`)}
            </span>
          );
          return (
            <SelectOption key={optionType} value={optionType} label={labelNode}>
              {labelNode}
            </SelectOption>
          );
        })}
      </Select>
    );

  }
);
