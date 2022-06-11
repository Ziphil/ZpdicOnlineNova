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

    const [data, setData] = useState<ChartData | null>(null);
    const [maxAxis, setMaxAxis] = useState(10);
    const [minAxis, setMinAxis] = useState(0);
    const [, {transNumber, transShortDate}] = useIntl();
    const {request} = useRequest();

    useMount(async () => {
      const number = dictionary.number;
      const from = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toString();
      const response = await request("fetchHistories", {number, from});
      if (response.status === 200 && !("error" in response.data)) {
        const histories = response.data;
        const dates = [...histories.map((history) => new Date(history.date)), new Date()];
        const wordSizes = [...histories.map((history) => history.wordSize), dictionary.wordSize];
        const maxWordSize = Math.max(...wordSizes);
        const minWordSize = Math.min(...wordSizes);
        const maxAxis = maxWordSize + Math.max((maxWordSize - minWordSize) * 0.05, 10);
        const minAxis = Math.max(minWordSize - Math.max((maxWordSize - minWordSize) * 0.05, 10), 0);
        const data = {x: "date", columns: [["date", ...dates], ["wordSize", ...wordSizes]], types: {wordSize: "area"}} as ChartData;
        setData(data);
        setMaxAxis(maxAxis);
        setMinAxis(minAxis);
      } else {
        setData(null);
        setMaxAxis(10);
        setMinAxis(0);
      }
    });

    const padding = 24 * 60 * 60 * 1000;
    const config = {
      padding: {left: 45},
      axis: {
        x: {tick: {format: transShortDate}, padding: {left: padding, right: padding}, type: "timeseries"},
        y: {tick: {format: transNumber}, max: maxAxis, min: minAxis, padding: {top: 0, bottom: 0}}
      }
    } as ChartConfig;
    const node = (
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