//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";


export const OverallAggregationPane = create(
  require("./overall-aggregation-pane.scss"), "OverallAggregationPane",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("topPage");

    const [aggregations] = useSuspenseResponse("fetchOverallAggregation", {});

    return (
      <div styleName="root" {...rest}>
        <div styleName="inner">
          <div styleName="item">
            <div styleName="count">{transNumber(aggregations.dictionary.count)}</div>
            <div styleName="label">{trans("aggregation.dictionary", {count: aggregations.dictionary.count})}</div>
          </div>
          <div styleName="item">
            <div styleName="count">{transNumber(aggregations.word.count)}</div>
            <div styleName="label">{trans("aggregation.word", {count: aggregations.word.count})}</div>
          </div>
          <div styleName="item">
            <div styleName="count">{transNumber(aggregations.example.count)}</div>
            <div styleName="label">{trans("aggregation.example", {count: aggregations.example.count})}</div>
          </div>
        </div>
      </div>
    );

  }
);
