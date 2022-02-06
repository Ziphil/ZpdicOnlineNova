//

import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import {
  useMount
} from "react-use";
import Icon from "/client/component/atom/icon";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useRequest
} from "/client/component/hook";
import {
  Aggregation
} from "/client/skeleton/aggregation";


const OverallAggregationPane = create(
  require("./overall-aggregation-pane.scss"), "OverallAggregationPane",
  function ({
  }: {
  }): ReactElement {

    let [dictionary, setDictionary] = useState<Aggregation | null>(null);
    let [word, setWord] = useState<Aggregation | null>(null);
    let [example, setExample] = useState<Aggregation | null>(null);
    let [user, setUser] = useState<Aggregation | null>(null);
    let [, {trans, transNumber}] = useIntl();
    let {request} = useRequest();

    useMount(async () => {
      let response = await request("fetchOverallAggregation", {}, {ignoreError: true});
      if (response.status === 200) {
        let body = response.data;
        setDictionary(body.dictionary);
        setWord(body.word);
        setExample(body.example);
        setUser(body.user);
      }
    });

    let node = (
      <div styleName="root">
        <div styleName="item">
          <div styleName="icon"><Icon name="user"/></div>
          <div styleName="count-wrapper">
            <div styleName="count">{transNumber(user?.count)}</div>
            <div styleName="unit">{trans("overallAggregationPane.user", {count: user?.count})}</div>
          </div>
        </div>
        <div styleName="item">
          <div styleName="icon"><Icon name="book"/></div>
          <div styleName="count-wrapper">
            <div styleName="count">{transNumber(dictionary?.count)}</div>
            <div styleName="unit">{trans("overallAggregationPane.dictionary", {count: dictionary?.count})}</div>
          </div>
        </div>
        <div styleName="item">
          <div styleName="icon"><Icon name="custom-word"/></div>
          <div styleName="count-wrapper">
            <div styleName="count">{transNumber(word?.count)}</div>
            <div styleName="unit">{trans("overallAggregationPane.word", {count: word?.count})}</div>
          </div>
        </div>
        <div styleName="item">
          <div styleName="icon"><Icon name="custom-example"/></div>
          <div styleName="count-wrapper">
            <div styleName="count">{transNumber(example?.count)}</div>
            <div styleName="unit">{trans("overallAggregationPane.example", {count: example?.count})}</div>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


export default OverallAggregationPane;