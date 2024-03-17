//

import {faCopy, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  Card,
  CardBody,
  CardFooter,
  GeneralIcon,
  IconButton,
  SingleLineText,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {getAwsFileUrl} from "/client/util/aws";
import {useDiscardResource} from "./resource-card-hook";


export const ResourceCard = create(
  require("./resource-card.scss"), "ResourceCard",
  function ({
    dictionary,
    resource,
    showFooter,
    showCode,
    ...rest
  }: {
    dictionary: Dictionary,
    resource: string,
    showFooter: boolean,
    showCode: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("resourceList");

    const discardResource = useDiscardResource(dictionary, resource);

    const code = `![${resource}](<~${resource}>)`;

    const copyCode = useCallback(async function (): Promise<void> {
      await copyToClipboard(code);
    }, [code]);

    return (
      <Card styleName="root" {...rest}>
        <CardBody>
          <div styleName="image-container">
            <img styleName="image" src={getAwsFileUrl(`resource/${dictionary.number}/${resource}`)}/>
          </div>
          <SingleLineText styleName="title">
            {resource}
          </SingleLineText>
          {(showCode) && (
            <div styleName="code-container">
              <pre styleName="code">
                {code}
              </pre>
              <IconButton scheme="gray" variant="light" label={trans("button.copy")} onClick={copyCode}>
                <GeneralIcon icon={faCopy}/>
              </IconButton>
            </div>
          )}
        </CardBody>
        {(showFooter) && (
          <CardFooter>
            <Button scheme="red" variant="underline" onClick={discardResource}>
              <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
              {trans("button.discard")}
            </Button>
          </CardFooter>
        )}
      </Card>
    );

  }
);


async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const element = document.createElement("input");
    element.value = text;
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
  }
}