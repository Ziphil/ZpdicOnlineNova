//

import {faEdit, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {EnhancedDictionary, Example} from "/client-new/skeleton";


export const ExampleCard = create(
  require("./example-card.scss"), "ExampleCard",
  function ({
    dictionary,
    example,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    example: Example,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber, transDate} = useTrans("exampleList");

    const [canEdit] = useResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "edit"});

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="parallel">
            <MultiLineText is="p">
              {example.sentence}
            </MultiLineText>
            <MultiLineText is="p">
              {example.translation}
            </MultiLineText>
          </div>
        </CardBody>
        {(canEdit) && (
          <CardFooter styleName="footer">
            <Button scheme="primary" variant="underline">
              <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
              {trans("button.edit")}
            </Button>
            <Button scheme="red" variant="underline">
              <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
              {trans("button.discard")}
            </Button>
          </CardFooter>
        )}
      </Card>
    );

  }
);