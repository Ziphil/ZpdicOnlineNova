//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {DictionaryList} from "/client-new/component/compound/dictionary-list";
import {create} from "/client-new/component/create";
import {AddDictionaryButton} from "/client-new/component/form/add-dictionary-button";
import {useMe} from "/client-new/hook/auth";
import {useSuspenseResponse} from "/client-new/hook/request";


export const UserDictionaryPart = create(
  require("./user-dictionary-part.scss"), "UserDictionaryPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const me = useMe();

    const {name} = useParams();
    const [user] = useSuspenseResponse("fetchOtherUser", {name: name!});
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