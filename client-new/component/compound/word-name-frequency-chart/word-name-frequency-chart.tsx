//

import {ReactElement, useCallback, useMemo} from "react";
import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {Dictionary, WordNameFrequencies} from "/client-new/skeleton";


export const WordNameFrequencyChart = create(
  require("./word-name-frequency-chart.scss"), "WordNameFrequencyChart",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {transNumber, transShortDate} = useTrans("wordNameFrequencyChart");

    const number = dictionary.number;
    const [frequencies] = useSuspenseResponse("fetchWordNameFrequencies", {number});

    const dataSpec = useMemo(() => calcChartDataSpec(frequencies), [frequencies]);

    const renderCustomizedLabel = useCallback(function ({cx, cy, midAngle, innerRadius, outerRadius, percent, index, char}: any): ReactElement {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
          {char}
        </text>
      );
    }, []);

    return (
      <div styleName="root" {...rest}>
        <ResponsiveContainer>
          <PieChart margin={{top: 0, right: 0, bottom: 0, left: 0}}>
            <Pie data={dataSpec.data} dataKey="count" nameKey="char" outerRadius="100%" labelLine={false} label={renderCustomizedLabel} isAnimationActive={false}>
              {dataSpec.data.map((entry, index) => (
                <Cell key={`cell-${index}`}/>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );

  }
);


function calcChartDataSpec(frequencies: WordNameFrequencies): {data: Array<{char: string, count: number}>} {
  const data = frequencies.char.map(([char, frequency]) => ({char, count: frequency.all}));
  const spec = {
    data
  };
  return spec;
}