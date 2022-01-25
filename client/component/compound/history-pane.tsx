//

import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import {
  useMount
} from "react-use";
import Chart from "/client/component/atom/chart";
import {
  ChartConfig,
  ChartData
} from "/client/component/atom/chart";
import Loading from "/client/component/compound/loading";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useIntl,
  useRequest
} from "/client/component/hook";
import {
  DetailedDictionary
} from "/client/skeleton/dictionary";


const HistoryPane = create(
  require("./history-pane.scss"), "HistoryPane",
  function ({
    dictionary,
    styles
  }: {
    dictionary: DetailedDictionary,
    styles?: StylesRecord
  }): ReactElement {

    let [data, setData] = useState<ChartData | null>(null);
    let [maxAxis, setMaxAxis] = useState(10);
    let [minAxis, setMinAxis] = useState(0);
    let [, {transNumber, transShortDate}] = useIntl();
    let {request} = useRequest();

    useMount(async () => {
      let number = dictionary.number;
      let from = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toString();
      let response = await request("fetchHistories", {number, from});
      if (response.status === 200 && !("error" in response.data)) {
        let histories = response.data;
        let dates = [...histories.map((history) => new Date(history.date)), new Date()];
        let wordSizes = [...histories.map((history) => history.wordSize), dictionary.wordSize];
        let maxWordSize = Math.max(...wordSizes);
        let minWordSize = Math.min(...wordSizes);
        let maxAxis = maxWordSize + Math.max((maxWordSize - minWordSize) * 0.05, 10);
        let minAxis = Math.max(minWordSize - Math.max((maxWordSize - minWordSize) * 0.05, 10), 0);
        let data = {x: "date", columns: [["date", ...dates], ["wordSize", ...wordSizes]], types: {wordSize: "area"}} as ChartData;
        setData(data);
        setMaxAxis(maxAxis);
        setMinAxis(minAxis);
      } else {
        setData(null);
        setMaxAxis(10);
        setMinAxis(0);
      }
    });

    let padding = 24 * 60 * 60 * 1000;
    let config = {
      padding: {left: 45},
      axis: {
        x: {tick: {format: transShortDate}, padding: {left: padding, right: padding}, type: "timeseries"},
        y: {tick: {format: transNumber}, max: maxAxis, min: minAxis, padding: {top: 0, bottom: 0}}
      }
    } as ChartConfig;
    let node = (
      <div styleName="root">
        <Loading loading={data === null}>
          <Chart className={styles!["chart"]} data={data!} config={config}/>
        </Loading>
      </div>
    );
    return node;

  }
);


export default HistoryPane;