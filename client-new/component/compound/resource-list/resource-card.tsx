//

import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, SingleLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {getAwsFileUrl} from "/client-new/util/aws";
import {useDiscardResource} from "./resource-card-hook";


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

    const {trans} = useTrans("resourceList");

    const discardResource = useDiscardResource(dictionary, resource);

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
        <CardFooter>
          <Button scheme="red" variant="underline" onClick={discardResource}>
            <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
            {trans("button.discard")}
          </Button>
        </CardFooter>
      </Card>
    );

  }
);