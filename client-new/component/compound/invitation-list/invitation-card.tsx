//

import {faBan, faThumbsUp} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  Card,
  CardBody,
  CardFooter,
  GeneralIcon,
  MultiLineText,
  SingleLineText,
  Tag,
  useTrans
} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {UserAvatar} from "/client-new/component/atom/user-avatar";
import {create} from "/client-new/component/create";
import {Invitation} from "/client-new/skeleton";
import {useAcceptInvitation, useRejectInvitation} from "./invitation-card-hook";


export const InvitationCard = create(
  require("./invitation-card.scss"), "InvitationCard",
  function ({
    invitation,
    ...rest
  }: {
    invitation: Invitation,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode, transDate} = useTrans("invitationList");

    const acceptInvitation = useAcceptInvitation(invitation);
    const rejectInvitation = useRejectInvitation(invitation);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="tag">
            <Tag variant="solid">{trans(`tag.${invitation.type}`)}</Tag>
          </div>
          <Link styleName="name" href={`/dictionary/${invitation.dictionary.paramName || invitation.dictionary.number}`} variant="unstyledSimple">
            <SingleLineText is="h3">
              {invitation.dictionary.name}
            </SingleLineText>
          </Link>
          <div styleName="date">
            <time dateTime={dayjs(invitation.createdDate).toISOString()}>{transDate(invitation.createdDate)}</time>
          </div>
          <MultiLineText styleName="explanation" is="p">
            {transNode(`explanation.${invitation.type}`, {
              userNode: (
                <Link styleName="user-link" href={`/user/${invitation.dictionary.user.name}`} variant="unstyledUnderline">
                  <UserAvatar styleName="avatar" user={invitation.dictionary.user}/>
                  {invitation.dictionary.user.screenName}
                </Link>
              )
            })}
          </MultiLineText>
        </CardBody>
        <CardFooter styleName="footer">
          <Button scheme="secondary" variant="underline" onClick={acceptInvitation}>
            <ButtonIconbag><GeneralIcon icon={faThumbsUp}/></ButtonIconbag>
            {trans("button.accept")}
          </Button>
          <Button scheme="red" variant="underline" onClick={rejectInvitation}>
            <ButtonIconbag><GeneralIcon icon={faBan}/></ButtonIconbag>
            {trans("button.reject")}
          </Button>
        </CardFooter>
      </Card>
    );

  }
);