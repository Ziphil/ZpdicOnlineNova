//

import {ReactElement} from "react";
import {useTrans} from "zographia";
import {create} from "/client-new/component/create";


export const WordNameFrequencyChartLabel = create(
  null, "WordNameFrequencyChartLabel",
  function ({
    index,
    char,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: {
    index: number,
    char: string,
    cx: number,
    cy: number,
    midAngle: number,
    innerRadius: number,
    outerRadius: number,
    percent: number
  }): ReactElement | null {

    const {trans} = useTrans("wordNameFrequencyChart");

    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    const show = percent > 0.03;

    return (show) ? (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
        {(char === "OTHER") ? trans("other") : char}
      </text>
    ) : null;

  } as any
);