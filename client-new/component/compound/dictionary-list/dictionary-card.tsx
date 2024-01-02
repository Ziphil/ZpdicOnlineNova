//

import {faUser} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, GeneralIcon, SingleLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedDictionary, UserDictionary} from "/client-new/skeleton";


export const DictionaryCard = create(
  require("./dictionary-card.scss"), "DictionaryCard",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DetailedDictionary | UserDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("dictionaryList");

    return (
      <Card styleName="root" {...rest}>
        <CardBody>
          <div styleName="left">
            <div>
              <SingleLineText styleName="name" is="h3">
                {dictionary.name}
              </SingleLineText>
              <div styleName="user">
                <GeneralIcon styleName="icon" icon={faUser}/>
                {dictionary.user.screenName}
              </div>
            </div>
            <dl styleName="table">
              <dt styleName="table-label">{trans("updatedDate")}</dt>
              <dd styleName="table-value">{transDate(dictionary.updatedDate)}</dd>
              <dt styleName="table-label">{trans("createdDate")}</dt>
              <dd styleName="table-value">{transDate(dictionary.createdDate)}</dd>
            </dl>
          </div>
          <div styleName="right">
          </div>
        </CardBody>
      </Card>
    );

  }
);