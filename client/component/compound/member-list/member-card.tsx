//

import {faBan} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, SingleLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Member} from "/server/internal/skeleton";
import {useDiscardMember} from "./member-list-hook";


export const MemberCard = create(
  require("./member-card.scss"), "MemberCard",
  function ({
    dictionary,
    member,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    member: Member,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("memberList");

    const user = member.user;
    const discardMember = useDiscardMember(dictionary, user);

    return (
      <Card styleName="root" {...rest}>
        <CardBody>
          <div styleName="top">
            <UserAvatar styleName="avatar" user={user}/>
            <div styleName="name-container">
              <Link styleName="screen-name" href={`/user/${user.name}`} variant="unstyledSimple">
                <SingleLineText>
                  {user.screenName}
                </SingleLineText>
              </Link>
              <SingleLineText styleName="name">
                @{user.name}
              </SingleLineText>
            </div>
          </div>
        </CardBody>
        <CardFooter styleName="footer">
          <Button scheme="red" variant="underline" onClick={discardMember}>
            <ButtonIconbag><GeneralIcon icon={faBan}/></ButtonIconbag>
            {trans("button.discard")}
          </Button>
        </CardFooter>
      </Card>
    );

  }
);
