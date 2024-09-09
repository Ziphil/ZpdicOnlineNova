/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {create} from "/client/component/create";
import {Commission, DictionaryWithExecutors, EditableWord} from "/client/skeleton";
import {useDiscardCommission} from "./commission-card-hook";


export const CommissionCard = create(
  require("./commission-card.scss"), "CommissionCard",
  function ({
    dictionary,
    commission,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    commission: Commission,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("commissionList");

    const word = useMemo(() => getWord(commission), [commission]);

    const discardCommission = useDiscardCommission(dictionary, commission);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <MultiLineText styleName="name">
            {commission.name}
          </MultiLineText>
          {(!!commission.comment) && (
            <MultiLineText styleName="comment">
              {commission.comment}
            </MultiLineText>
          )}
        </CardBody>
        <CardFooter styleName="footer">
          <EditWordDialog dictionary={dictionary} initialData={{type: "word", word}} trigger={(
            <Button scheme="secondary" variant="underline">
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add")}
            </Button>
          )}/>
          <Button scheme="red" variant="underline" onClick={discardCommission}>
            <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
            {trans("button.discard")}
          </Button>
        </CardFooter>
      </Card>
    );

  }
);


function getWord(commission: Commission): EditableWord {
  const word = {
    name: "",
    equivalents: [{titles: [], names: [commission.name], nameString: commission.name}],
    tags: [],
    informations: [{title: "", text: ""}],
    variations: [],
    relations: []
  };
  return word;
}