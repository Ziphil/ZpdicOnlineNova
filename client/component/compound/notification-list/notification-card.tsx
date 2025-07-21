//

import {IconDefinition, faBug, faBugSlash, faInfoCircle, faSparkles} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, GeneralIcon, MultiLineText, Tag, useTrans} from "zographia";
import {Markdown} from "/client/component/atom/markdown";
import {create} from "/client/component/create";
import {Notification} from "/server/internal/skeleton";


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
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="top">
            <div styleName="tag">
              <Tag is="span" variant="solid">{trans(`tag.${(notification.type === "bugFixed") ? "bug" : notification.type}`)}</Tag>
              {(notification.type === "bugFixed") && <Tag is="span" scheme="gray" variant="solid">{trans("tag.fixed")}</Tag>}
            </div>
            <div styleName="heading">
              <div styleName="icon">
                <GeneralIcon icon={getIcon(notification.type)}/>
              </div>
              <div styleName="heading-right">
                <MultiLineText styleName="title" is="h3" lineHeight="narrowFixed">
                  {notification.title}
                </MultiLineText>
                <div styleName="date">
                  <time dateTime={dayjs(notification.date).toISOString()}>{transDate(notification.date)}</time>
                </div>
              </div>
            </div>
          </div>
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