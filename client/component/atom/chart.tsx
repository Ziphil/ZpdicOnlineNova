//

import {
  ChartAPI,
  Data,
  ChartConfiguration as FullChartConfig,
  PrimitiveArray,
  generate as generateChart
} from "c3";
import merge from "lodash-es/merge";
import * as react from "react";
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

    const rootRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ChartAPI>();

    const getRenderTooltip = useCallback(function (): any {
      if (data.type === "pie") {
        const formatValue = config?.customTooltip?.format?.value;
        const formatPercent = config?.customTooltip?.format?.percent;
        const total = data.columns?.reduce((sum, column) => sum + +(column[1] ?? 0), 0) ?? 0;
        const renderTooltip = function (dataPoint: Array<any>, defaultFormatTitle: unknown, defaultFormatValue: unknown, getColor: (dataPoint: any) => any): string {
          const valueString = (formatValue !== undefined) ? formatValue(dataPoint[0].value, total) : `${dataPoint[0].value} / ${total}`;
          const percentString = (formatPercent !== undefined) ? formatPercent(dataPoint[0].ratio * 100) : dataPoint[0].ratio * 100;
          const string = valueString + "<br>" + percentString;
          const color = getColor(dataPoint[0]);
          return `<div class="c3-zptooltip" style="border-color:${color}">${string}</div>`;
        };
        return renderTooltip;
      } else {
        const formatValue = config?.customTooltip?.format?.value;
        const renderTooltip = function (dataPoint: Array<any>, defaultFormatTitle: unknown, defaultFormatValue: (...args: any) => any, getColor: (dataPoint: any) => any): string {
          const string = (formatValue !== undefined) ? formatValue(dataPoint[0].value, undefined) : defaultFormatValue(dataPoint[0].value);
          const color = getColor(dataPoint[0]);
          return `<div class="c3-zptooltip" style="border-color:${color}">${string}</div>`;
        };
        return renderTooltip;
      }
    }, [data, config]);

    const drawChart = useCallback(function (): void {
      const renderTooltip = getRenderTooltip();
      const defaultConfig = {
        transition: {duration: null},
        grid: {y: {show: true}},
        axis: {x: {tick: {outer: false}}, y: {tick: {outer: false}}},
        point: {r: 0, focus: {expand: {r: 3}}, select: {r: 3}},
        pie: {expand: false, label: {format: (value, ratio, id) => id}},
        legend: {show: false, position: "right"},
        tooltip: {contents: renderTooltip},
        color: {pattern: ["hsl(200, 60%, 45%)", "hsl(140, 45%, 50%)", "hsl(260, 30%, 50%)", "hsl(60, 45%, 50%)", "hsl(330, 30%, 50%)"]}
      } as ChartConfig;
      const finalConfig = merge(defaultConfig, config);
      chartRef.current = generateChart({bindto: rootRef.current, data, ...finalConfig});
    }, [data, config, getRenderTooltip]);

    useEffect(() => {
      drawChart();
    }, [data, config]);

    useUnmount(() => {
      chartRef.current?.destroy();
    });

    const node = (
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