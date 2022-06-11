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


const WordNameFrequencyPane = create(
  require("./word-name-frequency-pane.scss"), "WordNameFrequencyPane",
  function ({
    dictionary,
    styles
  }: {
    dictionary: DetailedDictionary,
    styles?: StylesRecord
  }): ReactElement {

    const [data, setData] = useState<ChartData | null>(null);
    const [, {trans}] = useIntl();
    const {request} = useRequest();

    useMount(async () => {
      const number = dictionary.number;
      const response = await request("fetchWordNameFrequencies", {number});
      if (response.status === 200 && !("error" in response.data)) {
        const frequencies = response.data;
        const rawColumns = frequencies.char.map(([char, frequency]) => [char, frequency.all] as const);
        rawColumns.sort((firstColumn, secondColumn) => secondColumn[1] - firstColumn[1]);
        const formerColumns = rawColumns.slice(0, 20);
        const otherColumns = (rawColumns.length > 20) ? [[trans("wordNameFrequencyPane.others"), rawColumns.slice(20, -1).reduce((sum, column) => sum + column[1], 0)]] : [];
        const columns = [...formerColumns, ...otherColumns];
        const colors = Object.fromEntries([[trans("wordNameFrequencyPane.others"), "hsl(30, 40%, 50%)"]]);
        const data = {columns, colors, type: "pie", order: null} as ChartData;
        setData(data);
      } else {
        setData(null);
      }
    });

    const config = {
      padding: {top: 0, bottom: 0, left: 0, right: 0},
      legend: {show: true},
      customTooltip: {
        format: {
          value: (value, total) => trans("wordNameFrequencyPane.value", {value, total}),
          percent: (percent) => trans("wordNameFrequencyPane.percent", {percent})
        }
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


export default WordNameFrequencyPane;