//

import * as react from "react";
import {
  ReactNode
} from "react";
import Chart from "/client/component/atom/chart";
import {
  ChartDataColumn
} from "/client/component/atom/chart";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/server/skeleton/dictionary";


@style(require("./dictionary-statistics-pane.scss"))
export default class DictionaryStatisticsPane extends Component<Props, State> {

  public async componentDidMount(): Promise<void> {
  }

  public render(): ReactNode {
    let data = {
      columns: [
        ["count", 1023, 1023, 1028, 1035, 1048, 1052, 1050, 1054, 1058, 1060] as ChartDataColumn
      ]
    };
    let config = {
      padding: {left: 40},
      axis: {x: {padding: {left: 0.3, right: 0.3}}, y: {tick: {format: this.transNumber.bind(this)}}}
    };
    let node = (
      <div styleName="root">
        <Chart data={data} config={config}/>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary
};
type State = {
};