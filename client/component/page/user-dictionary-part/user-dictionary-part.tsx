//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {DictionaryList} from "/client/component/compound/dictionary-list";
import {create} from "/client/component/create";
import {AddDictionaryButton} from "/client/component/form/add-dictionary-button";
import {useMe} from "/client/hook/auth";
import {useSuspenseResponse} from "/client/hook/request";


export const UserDictionaryPart = create(
  require("./user-dictionary-part.scss"), "UserDictionaryPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const me = useMe();

    const {name} = useParams();
    const [user] = useSuspenseResponse("fetchUser", {name: name!});
    const [dictionaries] = useSuspenseResponse("fetchUserDictionaries", {name: name!});

    return (
      <div styleName="root" {...rest}>
        <section>
          <div styleName="list-container">
            {(me?.id === user.id) && (
              <AddDictionaryButton/>
            )}
            <DictionaryList
              dictionaries={dictionaries}
              type="user"
              pageSpec={{size: 40}}
              showChart={true}
              showAuthority={me?.id === user.id}
              showSettingLink={me?.id === user.id}
            />
          </div>
        </section>
      </div>
    );

  }
);