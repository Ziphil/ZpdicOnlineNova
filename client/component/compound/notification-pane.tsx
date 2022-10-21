//

import {
  ReactElement
} from "react";
import Icon from "/client/component/atom/icon";
import Markdown from "/client/component/atom/markdown";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";
import {
  Notification
} from "/client/skeleton/notification";


const NotificationPane = create(
  require("./notification-pane.scss"), "NotificationPane",
  function ({
    notification,
    styles
  }: {
    notification: Notification,
    styles?: StylesRecord
  }): ReactElement {

    const {trans, transDate} = useTrans("notificationPane");

    const [iconName, iconSlashed] = (() => {
      const type = notification.type;
      if (type === "update") {
        return ["medal", false] as const;
      } else if (type === "bug") {
        return ["bug", false] as const;
      } else if (type === "bugFixed") {
        return ["bug", true] as const;
      } else {
        return ["info-circle", false] as const;
      }
    })();
    const node = (
      <div styleName="root">
        <div styleName="head-wrapper">
          <div styleName="icon">
            <Icon name={iconName} slashed={iconSlashed}/>
          </div>
          <div styleName="head-right">
            <div styleName="date">{transDate(notification.date)}</div>
            <h1 styleName="head">
              {(notification.type === "bugFixed") && (
                <span styleName="fixed">({trans("fixed")})</span>
              )}
              {notification.title}
            </h1>
          </div>
        </div>
        <Markdown className={styles!["content"]} source={notification.text}/>
      </div>
    );
    return node;

  }
);


export default NotificationPane;