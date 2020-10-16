//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Component from "/client/component/component";
import Loading from "/client/component/compound/loading";
import PaginationButton from "/client/component/compound/pagination-button";
import {
  style
} from "/client/component/decorator";
import {
  slices
} from "/client/util/misc";
import {
  StyleNameUtil
} from "/client/util/style-name";
import {
  WithSize
} from "/server/controller/interface/type";


@style(require("./pane-list.scss"))
export default class PaneList<T> extends Component<Props<T>, State<T>> {

  public static defaultProps: DefaultProps = {
    column: 1,
    method: "div",
    style: "spaced",
    border: false,
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

  private renderDivPanes(): ReactNode {
    let [hitItems, hitSize] = this.state.hitResult;
    let styleName = StyleNameUtil.create(
      "div-pane",
      {if: this.props.style === "spaced", true: "spaced"}
    );
    let style = {gridTemplateColumns: `repeat(${this.props.column}, 1fr)`};
    let panes = hitItems.map(this.props.renderer);
    let node = (
      <div styleName={styleName} style={style}>
        {panes}
      </div>
    );
    return node;
  }

  private renderTablePanes(): ReactNode {
    let [hitItems, hitSize] = this.state.hitResult;
    let styleName = StyleNameUtil.create(
      "table-pane",
      {if: this.props.style === "spaced", true: "spaced"}
    );
    let column = this.props.column;
    let rowPanes = slices(hitItems, column, true).map((rowItems, index) => {
      let cellPanes = rowItems.map((item, index) => {
        let innerPane = (item !== undefined) ? this.props.renderer(item) : undefined;
        let spacerNode = (index !== 0) && (
          <td styleName="spacer"/>
        );
        let borderSpacerNode = (this.props.border && index !== 0) && (
          <td styleName="spacer border"/>
        );
        let cellPane = (
          <Fragment key={index}>
            {spacerNode}
            {borderSpacerNode}
            <td>{innerPane}</td>
          </Fragment>
        );
        return cellPane;
      });
      let rowPane = <tr key={index}>{cellPanes}</tr>;
      return rowPane;
    });
    let node = (
      <table styleName={styleName}>
        <tbody>
          {rowPanes}
        </tbody>
      </table>
    );
    return node;
  }

  public render(): ReactNode {
    let panes = (this.props.method === "div") ? this.renderDivPanes() : this.renderTablePanes();
    let pagenationButtonNode = this.props.showPagination && this.renderPagenationButton();
    let node = (
      <div styleName="root">
        <Loading loading={this.state.loading}>
          {panes}
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
  method: "div" | "table",
  style: "spaced" | "compact",
  border: boolean,
  showPagination: boolean
};
type DefaultProps = {
  column: number,
  method: "div" | "table",
  style: "spaced" | "compact",
  border: boolean,
  showPagination: boolean
};
type State<T> = {
  page: number,
  hitResult: WithSize<T>,
  loading: boolean
};

export type ItemProvider<T> = (offset?: number, size?: number) => Promise<WithSize<T>>;