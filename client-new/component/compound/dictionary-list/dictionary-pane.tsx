//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, SingleLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedDictionary, UserDictionary} from "/client-new/skeleton";


export const DictionaryPane = create(
  require("./dictionary-pane.scss"), "DictionaryPane",
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