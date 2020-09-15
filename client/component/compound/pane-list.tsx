//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import Loading from "/client/component/compound/loading";
import PaginationButton from "/client/component/compound/pagination-button";
import {
  applyStyle
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";
import {
  WithSize
} from "/server/controller/type";


@applyStyle(require("./pane-list.scss"))
export default class PaneList<T> extends Component<Props<T>, State<T>> {

  public static defaultProps: DefaultProps = {
    column: 1,
    style: "spaced",
    showPagination: true
  };
  public state: State<T> = {
    page: 0,
    hitResult: [[], 0],
    loading: false
  };

  public async componentDidMount(): Promise<void> {
    let page = this.state.page;
    await this.handlePageSet(page);
  }

  public async componentDidUpdate(previousProps: any): Promise<void> {
    if (this.props.items !== previousProps.items) {
      let page = this.state.page;
      await this.handlePageSet(page);
    }
  }

  private async handlePageSet(page: number): Promise<void> {
    let offset = this.props.size * page;
    let size = this.props.size;
    let items = this.props.items;
    if (typeof items === "function") {
      this.setState({loading: true});
      let hitResult = await items(offset, size);
      this.setState({page, hitResult, loading: false});
    } else {
      if (items !== null) {
        let hitItems = items.slice(offset, offset + size);
        let hitSize = items.length;
        let hitResult = [hitItems, hitSize] as WithSize<T>;
        this.setState({page, hitResult, loading: false});
      } else {
        this.setState({loading: true});
      }
    }
  }

  private renderPagenationButton(): ReactNode {
    let [hitItems, hitSize] = this.state.hitResult;
    let maxPage = Math.max(Math.ceil(hitSize / this.props.size) - 1, 0);
    let styleName = StyleNameUtil.create(
      "pagination",
      {if: hitItems.length <= 0, true: "empty"}
    );
    let node = (
      <div styleName={styleName}>
        <PaginationButton page={this.state.page} minPage={0} maxPage={maxPage} onSet={(page) => this.handlePageSet(page)}/>
      </div>
    );
    return node;
  }

  public render(): ReactNode {
    let [hitItems, hitSize] = this.state.hitResult;
    let styleName = StyleNameUtil.create(
      "pane",
      {if: this.props.style === "compact", true: "compact"}
    );
    let style = {gridTemplateColumns: `repeat(${this.props.column}, 1fr)`};
    let panes = hitItems.map(this.props.renderer);
    let pagenationButtonNode = this.props.showPagination && this.renderPagenationButton();
    let node = (
      <div styleName="root">
        <Loading loading={this.state.loading}>
          <div styleName={styleName} style={style}>
            {panes}
          </div>
          {pagenationButtonNode}
        </Loading>
      </div>
    );
    return node;
  }

}


type Props<T> = {
  items: Array<T> | ItemProvider<T> | null,
  renderer: (item: T) => ReactNode,
  column: number,
  size: number,
  style: "spaced" | "compact"
  showPagination: boolean
};
type DefaultProps = {
  column: number,
  style: "spaced" | "compact",
  showPagination: boolean
};
type State<T> = {
  page: number,
  hitResult: WithSize<T>,
  loading: boolean
};

type ItemProvider<T> = (offset?: number, size?: number) => Promise<WithSize<T>>;