//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
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

    return (
      <main styleName="root" {...rest}>
        <Hero/>
        <OverallAggregationPane/>
      </main>
    );

  }
);
