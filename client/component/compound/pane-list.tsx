//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  PaginationButton
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  createStyleName
} from "/client/util/style-name";


@applyStyle(require("./pane-list.scss"))
export class PaneList<T> extends Component<Props<T>, State<T>> {

  public static defaultProps: Partial<Props<any>> = {
    column: 1
  };
  public state: State<T> = {
    page: 0,
    hitSize: 0,
    hitItems: []
  };

  public async componentDidMount(): Promise<void> {
    let page = this.state.page;
    await this.handlePageSet(page);
  }

  private async handlePageSet(page: number): Promise<void> {
    let offset = this.props.size * page;
    let size = this.props.size;
    let items = this.props.items;
    if (typeof items === "function") {
      let {hitSize, hitItems} = await items(offset, size);
      this.setState({page, hitSize, hitItems});
    } else {
      let hitItems = items.slice(offset, offset + size);
      let hitSize = items.length;
      this.setState({page, hitSize, hitItems});
    }
  }

  public render(): ReactNode {
    let maxPage = Math.max(Math.ceil(this.state.hitSize / this.props.size) - 1, 0);
    let panes = this.state.hitItems.map(this.props.renderer);
    let paneStyle = {gridTemplateColumns: `repeat(${this.props.column}, 1fr)`};
    let paginationStyleName = createStyleName(
      "pagination",
      {if: this.state.hitItems.length <= 0, true: "empty"}
    );
    let node = (
      <div styleName="root">
        <div styleName="pane" style={paneStyle}>
          {panes}
        </div>
        <div styleName={paginationStyleName}>
          <PaginationButton page={this.state.page} minPage={0} maxPage={maxPage} onSet={(page) => this.handlePageSet(page)}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props<T> = {
  items: Array<T> | ItemProvider<T>,
  renderer: (item: T) => ReactNode,
  column: number,
  size: number
};
type State<T> = {
  page: number,
  hitSize: number,
  hitItems: Array<T>
};

type ItemProvider<T> = (offset?: number, size?: number) => Promise<{hitSize: number, hitItems: Array<T>}>;