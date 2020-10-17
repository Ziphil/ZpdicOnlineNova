//

import * as react from "react";
import {
  ReactNode
} from "react";
import Chart from "/client/component/atom/chart";
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
        ["count", 1023, 1023, 1028, 1035, 1048, 1052, 1050, 1054, 1058, 1060] as [string, ...Array<number>],
        ["difference", 0, 0, 5, 7, 13, 4, 0, 4, 4, 2] as [string, ...Array<number>]
      ],
      axes: {
        difference: "y2" as const
      },
      types: {
        difference: "bar" as const
      }
    };
    let config = {
      axis: {y2: {show: true}}
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