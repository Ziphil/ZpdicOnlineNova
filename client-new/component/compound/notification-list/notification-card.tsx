//

import {IconDefinition, faBug, faBugSlash, faInfoCircle, faSparkles} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, GeneralIcon, MultiLineText, Tag, useTrans} from "zographia";
import {Markdown} from "/client-new/component/atom/markdown";
import {create} from "/client-new/component/create";
import {Notification} from "/client-new/skeleton";


export const NotificationCard = create(
  require("./notification-card.scss"), "NotificationCard",
  function ({
    notification,
    ...rest
  }: {
    notification: Notification,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("notificationList");

    return (
      <Card styleName="root" padding="wide" {...rest}>
        <CardBody>
          <div styleName="top">
            <div styleName="icon">
              <GeneralIcon icon={getIcon(notification.type)}/>
            </div>
            <div styleName="heading-container">
              <MultiLineText styleName="title" is="h3">
                {notification.title}
              </MultiLineText>
              <time styleName="date" dateTime={notification.date}>
                {transDate(notification.date)}
              </time>
            </div>
          </div>
          {(notification.type === "bugFixed") && (
            <Tag styleName="badge" is="span" scheme="secondary">{trans("fixed")}</Tag>
          )}
          <Markdown styleName="text" mode="normal">
            {notification.text}
          </Markdown>
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