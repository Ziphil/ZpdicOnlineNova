//

import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import {
  useMount
} from "react-use";
import Chart from "/client/component-function/atom/chart";
import {
  ChartConfig,
  ChartData
} from "/client/component-function/atom/chart";
import Loading from "/client/component-function/compound/loading";
import {
  StylesRecord,
  create
} from "/client/component-function/create";
import {
  useIntl,
  useRequest
} from "/client/component-function/hook";
import {
  DetailedDictionary
} from "/client/skeleton/dictionary";


const WordNameFrequencyPane = create(
  require("./word-name-frequency-pane.scss"), "WordNameFrequencyPane",
  function ({
    dictionary,
    styles
  }: {
    dictionary: DetailedDictionary,
    styles?: StylesRecord
  }): ReactElement {

    let [data, setData] = useState<ChartData | null>();
    let [, {trans}] = useIntl();
    let {request} = useRequest();

    useMount(async () => {
      let number = dictionary.number;
      let response = await request("fetchWordNameFrequencies", {number});
      if (response.status === 200 && !("error" in response.data)) {
        let frequencies = response.data;
        let rawColumns = frequencies.char.map(([char, frequency]) => [char, frequency.all] as const);
        rawColumns.sort((firstColumn, secondColumn) => secondColumn[1] - firstColumn[1]);
        let formerColumns = rawColumns.slice(0, 20);
        let otherColumns = (rawColumns.length > 20) ? [[trans("wordNameFrequencyPane.others"), rawColumns.slice(20, -1).reduce((sum, column) => sum + column[1], 0)]] : [];
        let columns = [...formerColumns, ...otherColumns];
        let colors = Object.fromEntries([[trans("wordNameFrequencyPane.others"), "hsl(30, 40%, 50%)"]]);
        let data = {columns, colors, type: "pie", order: null} as ChartData;
        setData(data);
      } else {
        setData(null);
      }
    });

    let config = {
      padding: {top: 0, bottom: 0, left: 0, right: 0},
      legend: {show: true},
      customTooltip: {
        format: {
          value: (value, total) => trans("wordNameFrequencyPane.value", {value, total}),
          percent: (percent) => trans("wordNameFrequencyPane.percent", {percent})
        }
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


export default WordNameFrequencyPane;