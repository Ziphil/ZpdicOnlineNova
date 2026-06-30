//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, CardFooter, SingleLineText} from "zographia";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Member} from "/server/internal/skeleton";
import {MemberFooter} from "./member-footer";


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

    const user = member.user;

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
          <MemberFooter dictionary={dictionary} user={user}/>
        </CardFooter>
      </Card>
    );

  }
);
