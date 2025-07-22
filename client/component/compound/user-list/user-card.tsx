//

import {IconDefinition, faBug, faBugSlash, faInfoCircle, faSparkles} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, ReactNode} from "react";
import {AdditionalProps, Card, CardBody, CardFooter, SingleLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {create} from "/client/component/create";
import {Notification, User} from "/server/internal/skeleton";


export const UserCard = create(
  require("./user-card.scss"), "UserCard",
  function ({
    user,
    renderFooter,
    ...rest
  }: {
    user: User,
    renderFooter?: (user: User) => ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("userList");

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
        {(renderFooter !== undefined) && (
          <CardFooter styleName="footer">
            {renderFooter(user)}
          </CardFooter>
        )}
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