/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {EditWordDialog} from "/client-new/component/compound/edit-word-dialog";
import {create} from "/client-new/component/create";
import {Commission, EditableWord, EnhancedDictionary} from "/client-new/skeleton";


export const CommissionCard = create(
  require("./commission-card.scss"), "CommissionCard",
  function ({
    dictionary,
    commission,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    commission: Commission,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("commissionList");

    const word = useMemo(() => getWord(commission), [commission]);

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
          <EditWordDialog dictionary={dictionary} word={word} trigger={(
            <Button scheme="secondary" variant="underline">
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add")}
            </Button>
          )}/>
          <Button scheme="red" variant="underline">
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
    name: commission.name,
    equivalents: [{titles: [], names: [commission.name]}],
    tags: [],
    informations: [{title: "", text: ""}],
    variations: [],
    relations: []
  };
  return word;
}