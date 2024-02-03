//

import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {AxisDomain} from "recharts/types/util/types";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {Dictionary, History} from "/client-new/skeleton";
import {HistoryChartTooltip} from "./history-chart-tooltip";


export const HistoryChart = create(
  require("./history-chart.scss"), "HistoryChart",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {transNumber, transShortDate} = useTrans("historyChart");

    const number = dictionary.number;
    const from = useMemo(() => dayjs().subtract(100, "day").startOf("hour").toISOString(), []);
    const [wordSize] = useSuspenseResponse("fetchWordSize", {number});
    const [histories] = useSuspenseResponse("fetchHistories", {number, from});

    const dataSpec = useMemo(() => calcChartDataSpec(histories, wordSize), [histories, wordSize]);

    return (
      <div styleName="root" {...rest}>
        <ResponsiveContainer>
          <AreaChart data={dataSpec.data} margin={{top: 0, right: 0, bottom: 0, left: 0}}>
            <Area
              styleName="area"
              dataKey="wordSize"
              isAnimationActive={false}
              activeDot={{strokeWidth: 0, r: 3}}
              strokeWidth={2}
              fillOpacity={1}
            />
            <XAxis
              styleName="axis"
              dataKey="date"
              type="number"
              padding="gap"
              domain={dataSpec.dateDomain}
              height={20}
              tickCount={12}
              tickFormatter={transShortDate}
            />
            <YAxis
              styleName="axis"
              domain={dataSpec.wordSizeDomain}
              width={32}
              tickCount={5}
              tickFormatter={(wordSize) => transNumber(wordSize, 0)}
            />
            <Tooltip
              cursor={{strokeDasharray: "3 3"}}
              content={<HistoryChartTooltip/>}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );

  }
);


function calcChartDataSpec(histories: Array<History>, wordSize: number): {data: Array<{date: number, wordSize: number}>, dateDomain: AxisDomain, wordSizeDomain: AxisDomain} {
  const nowDate = dayjs().valueOf();
  const beforeData = histories.map((history) => ({date: dayjs(history.date).valueOf(), wordSize: history.wordSize}));
  const data = [...beforeData, {date: nowDate, wordSize}];
  data.sort((firstData, secondData) => firstData.date - secondData.date);
  const wordSizes = data.map((item) => item.wordSize);
  const maxWordSize = Math.max(...wordSizes);
  const minWordSize = Math.min(...wordSizes);
  const maxWordSizeDomain = Math.round(maxWordSize + Math.max((maxWordSize - minWordSize) * 0.05, 10));
  const minWordSizeDomain = Math.round(Math.max(minWordSize - Math.max((maxWordSize - minWordSize) * 0.05, 10), 0));
  const spec = {
    data,
    dateDomain: [dayjs().subtract(100, "day").startOf("hour").valueOf(), nowDate] as AxisDomain,
    wordSizeDomain: [minWordSizeDomain, maxWordSizeDomain] as AxisDomain
  };
  return spec;
}