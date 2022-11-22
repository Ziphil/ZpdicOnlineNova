//

import {
  ReactElement
} from "react";
import Chart from "/client/component/atom/chart";
import {
  ChartConfig,
  ChartData
} from "/client/component/atom/chart";
import {
  create
} from "/client/component/create";
import {
  useSuspenseQuery,
  useTrans
} from "/client/component/hook";
import {
  DetailedDictionary,
  WordNameFrequencies
} from "/client/skeleton/dictionary";


const WordNameFrequencyPane = create(
  require("./word-name-frequency-pane.scss"), "WordNameFrequencyPane",
  function ({
    dictionary
  }: {
    dictionary: DetailedDictionary
  }): ReactElement {

    const {trans} = useTrans("wordNameFrequencyPane");

    const number = dictionary.number;
    const [frequencies] = useSuspenseQuery("fetchWordNameFrequencies", {number});

    const {data} = calcChartSpec(frequencies, trans("others"));
    const config = {
      padding: {top: 0, bottom: 0, left: 0, right: 0},
      legend: {show: true},
      customTooltip: {
        format: {
          value: (value, total) => trans("value", {value, total}),
          percent: (percent) => trans("percent", {percent})
        }
      }
    } as ChartConfig;
    const node = (
      <div styleName="root">
        <Chart styleName="chart" data={data} config={config}/>
      </div>
    );
    return node;

  }
);


function calcChartSpec(frequencies: WordNameFrequencies, othersString: string): {data: ChartData} {
  const rawColumns = frequencies.char.map(([char, frequency]) => [char, frequency.all] as const);
  rawColumns.sort((firstColumn, secondColumn) => secondColumn[1] - firstColumn[1]);
  const formerColumns = rawColumns.slice(0, 20);
  const otherColumns = (rawColumns.length > 20) ? [[othersString, rawColumns.slice(20, -1).reduce((sum, column) => sum + column[1], 0)]] : [];
  const columns = [...formerColumns, ...otherColumns];
  const colors = Object.fromEntries([[othersString, "var(--accent-color)"]]);
  const data = {columns, colors, type: "pie", order: null} as ChartData;
  return {data};
}

export default WordNameFrequencyPane;