//

import {faBan, faThumbsUp} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Invitation} from "/client-new/skeleton";


export const InvitationCard = create(
  require("./invitation-card.scss"), "InvitationCard",
  function ({
    invitation,
    ...rest
  }: {
    invitation: Invitation,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber, transDate} = useTrans("invitationList");

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {invitation.dictionary.name}
        </CardBody>
        <CardFooter styleName="footer">
          <Button scheme="secondary" variant="underline">
            <ButtonIconbag><GeneralIcon icon={faThumbsUp}/></ButtonIconbag>
            {trans("button.accept")}
          </Button>
          <Button scheme="red" variant="underline">
            <ButtonIconbag><GeneralIcon icon={faBan}/></ButtonIconbag>
            {trans("button.reject")}
          </Button>
        </CardFooter>
      </Card>
    );

  }
);