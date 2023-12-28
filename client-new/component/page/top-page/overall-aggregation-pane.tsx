//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useSuspenseQuery} from "/client-new/hook/request";


export const OverallAggregationPane = create(
  require("./overall-aggregation-pane.scss"), "OverallAggregationPane",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("topPage");

    const [aggregations] = useSuspenseQuery("fetchOverallAggregation", {});

    return (
      <div styleName="root" {...rest}>
        <div styleName="inner">
          <div styleName="item">
            <div styleName="count">{transNumber(aggregations.dictionary.count)}</div>
            <div styleName="label">{trans("aggregation.dictionary")}</div>
          </div>
          <div styleName="item">
            <div styleName="count">{transNumber(aggregations.word.count)}</div>
            <div styleName="label">{trans("aggregation.word")}</div>
          </div>
          <div styleName="item">
            <div styleName="count">{transNumber(aggregations.example.count)}</div>
            <div styleName="label">{trans("aggregation.example")}</div>
          </div>
        </div>
      </div>
    );

  }
);
