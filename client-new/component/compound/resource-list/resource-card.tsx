//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, SingleLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {getAwsFileUrl} from "/client-new/util/aws";


export const ResourceCard = create(
  require("./resource-card.scss"), "ResourceCard",
  function ({
    dictionary,
    resource,
    ...rest
  }: {
    dictionary: Dictionary,
    resource: string,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("resourceList");

    return (
      <Card styleName="root" {...rest}>
        <CardBody>
          <div styleName="image-container">
            <img styleName="image" src={getAwsFileUrl(`resource/${dictionary.number}/${resource}`)}/>
          </div>
          <SingleLineText styleName="title">
            {resource}
          </SingleLineText>
        </CardBody>
      </Card>
    );

  }
);