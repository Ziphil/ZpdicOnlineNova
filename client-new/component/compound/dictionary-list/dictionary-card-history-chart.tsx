//

import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {Area, AreaChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {AxisDomain} from "recharts/types/util/types";
import {AdditionalProps} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedDictionary, History, UserDictionary} from "/client-new/skeleton";


export const DictionaryCardHistoryChart = create(
  require("./dictionary-card-history-chart.scss"), "DictionaryCardHistoryChart",
  function ({
    dictionary,
    histories,
    ...rest
  }: {
    dictionary: DetailedDictionary | UserDictionary,
    histories: Array<History>,
    className?: string
  } & AdditionalProps): ReactElement {

    const dataSpec = useMemo(() => calcChartDataSpec(histories), [histories]);

    return (
      <div styleName="root" {...rest}>
        <ResponsiveContainer>
          <AreaChart data={dataSpec.data} margin={{top: 0, right: 0, bottom: 0, left: 0}}>
            <Area styleName="area" dataKey="difference" isAnimationActive={false} fillOpacity={1}/>
            <XAxis dataKey="date" type="number" domain={dataSpec.dateDomain} hide={true}/>
            <YAxis domain={dataSpec.differenceDomain} hide={true}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );

  }
);


function calcChartDataSpec(histories: Array<History>): {data: Array<{date: number, difference: number}>, dateDomain: AxisDomain, differenceDomain: AxisDomain} {
  const data = [];
  for (let i = 0 ; i < histories.length - 1 ; i ++) {
    const difference = histories[i].wordSize - histories[i + 1].wordSize;
    const duration = dayjs(histories[i].date).diff(histories[i + 1].date, "day", true);
    const adjustedDifference = Math.max(Math.min(difference / duration, 20), 0);
    data.push({date: dayjs(histories[i].date).unix(), difference: adjustedDifference});
  }
  const spec = {
    data,
    dateDomain: [dayjs().subtract(16, "day").unix(), data[0]?.date ?? dayjs().unix()] as AxisDomain,
    differenceDomain: [0, 20] as AxisDomain
  };
  return spec;
}