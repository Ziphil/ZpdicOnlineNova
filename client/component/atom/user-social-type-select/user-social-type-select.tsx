//

import {ReactElement} from "react";
import {AdditionalProps, Select, SelectOption} from "zographia";
import {create} from "/client/component/create";
import {USER_SOCIAL_TYPES, UserSocialType} from "/server/internal/skeleton";
import {UserSocialTypeSelectLabel} from "./user-social-type-select-label";


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

    return (
      <Select styleName="root" value={type} onSet={onSet} {...rest}>
        {optionTypes.map((optionType) => (
          <SelectOption
            key={optionType}
            value={optionType}
            label={<UserSocialTypeSelectLabel type={optionType}/>}
          >
            <UserSocialTypeSelectLabel type={optionType}/>
          </SelectOption>
        ))}
      </Select>
    );

  }
);