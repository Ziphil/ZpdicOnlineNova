//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {NotificationList} from "/client-new/component/compound/notification-list";
import {create} from "/client-new/component/create";
import {Hero} from "./hero";
import {OverallAggregationPane} from "./overall-aggregation-pane";


export const TopPage = create(
  require("./top-page.scss"), "TopPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("topPage");

    return (
      <main styleName="root" {...rest}>
        <div styleName="top">
          <Hero/>
          <OverallAggregationPane/>
        </div>
        <div styleName="main">
          <section>
            <h2 styleName="heading">{trans("heading.notification")}</h2>
            <NotificationList size={10}/>
          </section>
        </div>
      </main>
    );

  }
);
