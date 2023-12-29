//

import {IconDefinition, faBug, faBugSlash, faInfoCircle, faSparkles} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, GeneralIcon, Markdown, MultiLineText, Tag, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Notification} from "/client-new/skeleton";


export const NotificationPane = create(
  require("./notification-pane.scss"), "NotificationPane",
  function ({
    notification,
    ...rest
  }: {
    notification: Notification,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("notificationList");

    const node = (
      <Card styleName="root" {...rest}>
        <CardBody>
          <div styleName="top">
            <div styleName="icon">
              <GeneralIcon icon={getIcon(notification.type)}/>
            </div>
            <div styleName="heading-container">
              <MultiLineText styleName="heading" is="h3">{notification.title}</MultiLineText>
              <time styleName="date" dateTime={notification.date}>{transDate(notification.date)}</time>
            </div>
          </div>
          {(notification.type === "bugFixed") && (
            <Tag styleName="badge" is="span" scheme="secondary">{trans("fixed")}</Tag>
          )}
          <Markdown styleName="text">
            {notification.text}
          </Markdown>
        </CardBody>
      </Card>
    );
    return node;

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