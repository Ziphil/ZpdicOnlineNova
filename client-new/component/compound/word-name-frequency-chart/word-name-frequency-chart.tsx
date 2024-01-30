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

    const {trans, transNumber} = useTrans("wordNameFrequencyChart");

    const number = dictionary.number;
    const [frequencies] = useSuspenseResponse("fetchWordNameFrequencies", {number});

    const dataSpec = useMemo(() => calcChartDataSpec(frequencies), [frequencies]);

    const renderCustomizedLabel = useCallback(function ({cx, cy, midAngle, innerRadius, outerRadius, percent, index, char}: any): ReactElement | null {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
      const show = percent > 0.03;
      return (show) ? (
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
          {(char === "OTHER") ? trans("other") : char}
        </text>
      ) : null;
    }, [trans]);

    return (
      <div styleName="root" {...rest}>
        <ResponsiveContainer>
          <PieChart styleName="pie-chart" margin={{top: 0, right: 0, bottom: 0, left: 0}}>
            <Pie
              styleName="pie"
              data={dataSpec.data}
              dataKey="count"
              nameKey="char"
              innerRadius="50%"
              outerRadius="100%"
              labelLine={false}
              label={renderCustomizedLabel}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
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
  const rawData = frequencies.char.map(([char, frequency]) => ({char, count: frequency.all}));
  rawData.sort((firstItem, secondItem) => secondItem.count - firstItem.count);
  const topData = rawData.slice(0, 20);
  const otherData = (rawData.length > 20) ? [{char: "OTHER", count: rawData.slice(20, -1).reduce((sum, column) => sum + column.count, 0)}] : [];
  const data = [...topData, ...otherData];
  const spec = {
    data
  };
  return spec;
}