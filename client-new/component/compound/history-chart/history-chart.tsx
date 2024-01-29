//

import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {Area, AreaChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {AxisDomain} from "recharts/types/util/types";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {Dictionary, History} from "/client-new/skeleton";


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
            <Area styleName="area" dataKey="wordSize" isAnimationActive={false} fillOpacity={1}/>
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
              domain={["dataMin", "dataMax"]}
              width={40}
              tickCount={5}
              tickFormatter={(wordSize) => transNumber(wordSize)}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );

  }
);


function calcChartDataSpec(histories: Array<History>, wordSize: number): {data: Array<{date: number, wordSize: number}>, dateDomain: AxisDomain} {
  const nowDate = dayjs().valueOf();
  const data = [
    ...histories.reverse().map((history) => ({date: dayjs(history.date).valueOf(), wordSize: history.wordSize})),
    {date: nowDate, wordSize}
  ].sort((firstData, secondData) => firstData.date - secondData.date);
  const spec = {
    data,
    dateDomain: [dayjs().subtract(100, "day").startOf("hour").valueOf(), nowDate] as AxisDomain
  };
  return spec;
}