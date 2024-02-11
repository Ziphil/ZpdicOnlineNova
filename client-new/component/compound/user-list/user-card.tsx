//

import {IconDefinition, faBug, faBugSlash, faInfoCircle, faSparkles} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, SingleLineText, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {UserAvatar} from "/client-new/component/atom/user-avatar";
import {create} from "/client-new/component/create";
import {Notification, User} from "/client-new/skeleton";


export const UserCard = create(
  require("./user-card.scss"), "UserCard",
  function ({
    user,
    ...rest
  }: {
    user: User,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("userList");

    return (
      <Card styleName="root" {...rest}>
        <CardBody>
          <div styleName="top">
            <UserAvatar styleName="avatar" user={user}/>
            <div styleName="name-container">
              <SingleLineText styleName="screen-name">
                <Link href={`/user/${user.name}`} variant="unstyledSimple">
                  {user.screenName}
                </Link>
              </SingleLineText>
              <SingleLineText styleName="name">
                @{user.name}
              </SingleLineText>
            </div>
          </div>
        </CardBody>
      </Card>
    );

  }
);


function getIcon(type: Notification["type"]): IconDefinition {
  if (type === "update") {
    return faSparkles;
  } else if (type === "bug") {
    return faBug;
  } else if (type === "bugFixed") {
    return faBugSlash;
  } else {
    return faInfoCircle;
  }
}