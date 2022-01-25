//

import {
  ChartAPI,
  Data,
  ChartConfiguration as FullChartConfig,
  PrimitiveArray,
  generate as generateChart
} from "c3";
import merge from "lodash-es/merge";
import * as react from "react";;
import {
  ReactElement,
  useCallback,
  useEffect,
  useRef
} from "react";
import {
  useUnmount
} from "react-use";
import {
  create
} from "/client/component/create";


const Chart = create(
  require("./chart.scss"), "Chart",
  function ({
    data,
    config,
    className
  }: {
    data: ChartData,
    config?: ChartConfig,
    className?: string
  }): ReactElement {

    let rootRef = useRef<HTMLDivElement>(null);
    let chartRef = useRef<ChartAPI>();

    let getRenderTooltip = useCallback(function (): any {
      if (data.type === "pie") {
        let formatValue = config?.customTooltip?.format?.value;
        let formatPercent = config?.customTooltip?.format?.percent;
        let total = data.columns?.reduce((sum, column) => sum + +(column[1] ?? 0), 0) ?? 0;
        let renderTooltip = function (dataPoint: Array<any>, defaultFormatTitle: unknown, defaultFormatValue: unknown, getColor: (dataPoint: any) => any): string {
          let valueString = (formatValue !== undefined) ? formatValue(dataPoint[0].value, total) : `${dataPoint[0].value} / ${total}`;
          let percentString = (formatPercent !== undefined) ? formatPercent(dataPoint[0].ratio * 100) : dataPoint[0].ratio * 100;
          let string = valueString + "<br>" + percentString;
          let color = getColor(dataPoint[0]);
          return `<div class="c3-zptooltip" style="border-color:${color}">${string}</div>`;
        };
        return renderTooltip;
      } else {
        let formatValue = config?.customTooltip?.format?.value;
        let renderTooltip = function (dataPoint: Array<any>, defaultFormatTitle: unknown, defaultFormatValue: (...args: any) => any, getColor: (dataPoint: any) => any): string {
          let string = (formatValue !== undefined) ? formatValue(dataPoint[0].value, undefined) : defaultFormatValue(dataPoint[0].value);
          let color = getColor(dataPoint[0]);
          return `<div class="c3-zptooltip" style="border-color:${color}">${string}</div>`;
        };
        return renderTooltip;
      }
    }, [data, config]);

    let drawChart = useCallback(function (): void {
      let renderTooltip = getRenderTooltip();
      let defaultConfig = {
        transition: {duration: null},
        grid: {y: {show: true}},
        axis: {x: {tick: {outer: false}}, y: {tick: {outer: false}}},
        point: {r: 0, focus: {expand: {r: 3}}, select: {r: 3}},
        pie: {expand: false, label: {format: (value, ratio, id) => id}},
        legend: {show: false, position: "right"},
        tooltip: {contents: renderTooltip},
        color: {pattern: ["hsl(200, 60%, 45%)", "hsl(140, 45%, 50%)", "hsl(260, 30%, 50%)", "hsl(60, 45%, 50%)", "hsl(330, 30%, 50%)"]}
      } as ChartConfig;
      let finalConfig = merge(defaultConfig, config);
      chartRef.current = generateChart({bindto: rootRef.current, data, ...finalConfig});
    }, [data, config, getRenderTooltip]);

    useEffect(() => {
      drawChart();
    }, [data, config]);

    useUnmount(() => {
      chartRef.current?.destroy();
    });

    let node = (
      <div styleName="root" className={className} ref={rootRef}/>
    );
    return node;

  }
);


export type ChartData = Data;
export type ChartDataRow = PrimitiveArray;
export type ChartDataColumn = [string, ...PrimitiveArray];
export type ChartConfig = Omit<FullChartConfig, "bindto" | "data"> & CustomChartConfig;
export type CustomChartConfig = {customTooltip?: {format?: CustomTooltipFormatters}};
export type CustomTooltipFormatters = {value?: (value: any, total?: any) => string, percent?: (percent: any) => string};

export default Chart;