//

import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import {
  useMount
} from "react-use";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  useRequest
} from "/client/component-function/hook";
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
    let [, {trans, transNumber}] = useIntl();
    let {request} = useRequest();

    useMount(async () => {
      let response = await request("fetchOverallAggregation", {}, {ignoreError: true});
      if (response.status === 200) {
        let body = response.data;
        setDictionary(body.dictionary);
        setWord(body.word);
        setExample(body.example);
      }
    });

    let node = (
      <div styleName="root">
        <div styleName="count-wrapper">
          <div styleName="title">{trans("overallAggregationPane.dictionaryCount")}</div>
          <div styleName="count">{transNumber(dictionary?.count)}</div>
          <div styleName="slash">/</div>
          <div styleName="whole-count">{transNumber(dictionary?.wholeCount)}</div>
          <div styleName="title">{trans("overallAggregationPane.wordCount")}</div>
          <div styleName="count">{transNumber(word?.count)}</div>
          <div styleName="slash">/</div>
          <div styleName="whole-count">{transNumber(word?.wholeCount)}</div>
          <div styleName="title">{trans("overallAggregationPane.exampleCount")}</div>
          <div styleName="count">{transNumber(example?.count)}</div>
          <div styleName="slash">/</div>
          <div styleName="whole-count">{transNumber(example?.wholeCount)}</div>
        </div>
      </div>
    );
    return node;

  }
);


export default OverallAggregationPane;