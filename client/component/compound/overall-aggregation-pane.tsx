//

import {
  ReactElement
} from "react";
import Icon from "/client/component/atom/icon";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useSuspenseQuery
} from "/client/component/hook";


const OverallAggregationPane = create(
  require("./overall-aggregation-pane.scss"), "OverallAggregationPane",
  function ({
  }: {
  }): ReactElement {

    const [aggregations] = useSuspenseQuery("fetchOverallAggregation", {});
    const [, {trans, transNumber}] = useIntl();

    const node = (
      <div styleName="root">
        <div styleName="item">
          <div styleName="icon"><Icon name="user"/></div>
          <div styleName="count-wrapper">
            <div styleName="count">{transNumber(aggregations.user?.count)}</div>
            <div styleName="unit">{trans("overallAggregationPane.user", {count: aggregations.user?.count})}</div>
          </div>
        </div>
        <div styleName="item">
          <div styleName="icon"><Icon name="book"/></div>
          <div styleName="count-wrapper">
            <div styleName="count">{transNumber(aggregations.dictionary?.count)}</div>
            <div styleName="unit">{trans("overallAggregationPane.dictionary", {count: aggregations.dictionary?.count})}</div>
          </div>
        </div>
        <div styleName="item">
          <div styleName="icon"><Icon name="custom-word"/></div>
          <div styleName="count-wrapper">
            <div styleName="count">{transNumber(aggregations.word?.count)}</div>
            <div styleName="unit">{trans("overallAggregationPane.word", {count: aggregations.word?.count})}</div>
          </div>
        </div>
        <div styleName="item">
          <div styleName="icon"><Icon name="custom-example"/></div>
          <div styleName="count-wrapper">
            <div styleName="count">{transNumber(aggregations.example?.count)}</div>
            <div styleName="unit">{trans("overallAggregationPane.example", {count: aggregations.example?.count})}</div>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


export default OverallAggregationPane;