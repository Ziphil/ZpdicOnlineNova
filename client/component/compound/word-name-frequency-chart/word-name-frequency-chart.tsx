//

import Color from "colorjs.io";
import {ReactElement, useMemo} from "react";
import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";
import {AdditionalProps, useLeveledColor} from "zographia";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {Dictionary, WordNameFrequencies} from "/client/skeleton";
import {WordNameFrequencyChartLabel} from "./word-name-frequency-chart-label";


export const WordNameFrequencyChart = create(
  require("./word-name-frequency-chart.scss"), "WordNameFrequencyChart",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const number = dictionary.number;
    const [frequencies] = useSuspenseResponse("fetchWordNameFrequencies", {number});

    const dataSpec = useMemo(() => calcChartDataSpec(frequencies), [frequencies]);

    const colors = PIE_SCHEMES.map((scheme) => toColorString(useLeveledColor(scheme, 3)));
    const otherColor = toColorString(useLeveledColor("gray", 3));

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
              label={<WordNameFrequencyChartLabel/>}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {dataSpec.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={(entry.char === "OTHER") ? otherColor : colors[index % 5]}/>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );

  }
);


const PIE_SCHEMES = ["blue", "red", "green", "yellow", "purple"] as const;

function toColorString(color: Color): string {
  return color.to("srgb").toString({format: "hex"});
}

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