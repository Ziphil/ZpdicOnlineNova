/* eslint-disable no-useless-computed-key */

import {ReactElement, useCallback} from "react";
import {AsyncSelect, AsyncSelectOption} from "zographia";
import {create} from "/client-new/component/create";
import {User} from "/client-new/skeleton";
import {request} from "/client-new/util/request";
import {switchResponse} from "/client-new/util/response";


export const UserSelect = create(
  require("./user-select.scss"), "UserSelect",
  function ({
    user,
    error,
    onSet,
    ...rest
  }: {
    user: User | null,
    error?: boolean,
    onSet: (user: User) => unknown,
    className?: string
  }): ReactElement {

    const loadOptions = useCallback(async function (pattern: string): Promise<Array<User>> {
      const response = await request("suggestUsers", {pattern}, {ignoreError: true});
      return switchResponse(response, (data) => {
        return data;
      }, (error) => {
        return [];
      });
    }, []);

    return (
      <AsyncSelect styleName="root" value={user} error={error} onSet={onSet} loadOptions={loadOptions} {...rest}>
        {(user) => (
          <AsyncSelectOption>
            {user.screenName}
            (@{user.name})
          </AsyncSelectOption>
        )}
      </AsyncSelect>
    );

  }
);