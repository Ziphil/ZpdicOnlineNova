//

import {ReactElement} from "react";
import {useTrans} from "zographia";
import {create} from "/client-new/component/create";


export const HistoryChartTooltip = create(
  require("./history-chart-tooltip.scss"), "HistoryChartTooltip",
  function ({
    payload
  }: {
    payload: any
  }): ReactElement {

    const {transNumber, transDate} = useTrans("historyChart");

    const {date, wordSize} = payload[0]?.payload ?? {};

    return (
      <div styleName="root">
        <div styleName="date">{transDate(date)}</div>
        <div styleName="value">{transNumber(wordSize)}</div>
      </div>
    );

  } as any
);
