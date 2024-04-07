/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, MultiLineText, data, useTrans} from "zographia";
import {DictionaryAuthorizedUserList} from "/client/component/compound/dictionary-authorized-user-list";
import {create} from "/client/component/create";
import {AddEditInvitationButton} from "/client/component/form/add-edit-invitation-button";
import {AddTransferInvitationButton} from "/client/component/form/add-transfer-invitation-button";
import {DictionaryWithExecutors} from "/client/skeleton";


export const DictionarySettingAuthorityPart = create(
  require("./dictionary-setting-authority-part.scss"), "DictionarySettingAuthorityPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingAuthorityPart");

    const {dictionary} = useOutletContext<{dictionary: DictionaryWithExecutors}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.editInvitation")}</h3>
          <MultiLineText styleName="description">
            {trans("description.editInvitation")}
          </MultiLineText>
          <div styleName="list-container">
            <AddEditInvitationButton dictionary={dictionary}/>
            <DictionaryAuthorizedUserList dictionary={dictionary} pageSpec={{size: 20}}/>
          </div>
        </section>
        <section styleName="section">
          <h3 styleName="heading" {...data({danger: true})}>{trans("heading.transferInvitation")}</h3>
          <AddTransferInvitationButton dictionary={dictionary}/>
        </section>
      </div>
    );

  }
);