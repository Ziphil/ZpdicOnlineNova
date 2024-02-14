/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {EnhancedDictionary} from "/client/skeleton/dictionary";
import {create} from "/client-new/component/create";
import {AddEditInvitationForm} from "/client-new/component/form/add-edit-invitation-form";
import {AddTransferInvitationForm} from "/client-new/component/form/add-transfer-invitation-form";


export const DictionarySettingAuthorityPart = create(
  require("./dictionary-setting-authority-part.scss"), "DictionarySettingAuthorityPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingAuthorityPart");

    const {dictionary} = useOutletContext<{dictionary: EnhancedDictionary}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.editInvitation")}</h3>
          <MultiLineText styleName="description">
            {trans("description.editInvitation")}
          </MultiLineText>
          <AddEditInvitationForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.transferInvitation")}</h3>
          <AddTransferInvitationForm dictionary={dictionary}/>
        </section>
      </div>
    );

  }
);