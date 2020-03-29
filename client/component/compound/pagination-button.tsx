//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./pagination-button.scss"))
export class PaginationButton extends Component<Props, State> {

  public constructor(props: any) {
    super(props);
    let page = this.props.page;
    this.state = {page};
  }

  public componentDidUpdate(previousProps: Props): void {
    if (this.props.page !== previousProps.page) {
      let page = this.props.page;
      this.setState({page});
    }
  }

  private movePreviousPage(): void {
    let page = this.state.page - 1;
    if (page < this.props.minPage) {
      page = this.props.minPage;
    }
    this.setState({page});
    if (this.props.onSet) {
      this.props.onSet(page);
    }
  }

  private moveNextPage(): void {
    let page = this.state.page + 1;
    if (page > this.props.maxPage) {
      page = this.props.maxPage;
    }
    this.setState({page});
    if (this.props.onSet) {
      this.props.onSet(page);
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <Button label="前ページ" position="left" disabled={this.state.page <= this.props.minPage} onClick={this.movePreviousPage.bind(this)}/>
        <Button label="次ページ" position="right" disabled={this.state.page >= this.props.maxPage} onClick={this.moveNextPage.bind(this)}/>
      </div>
    );
    return node;
  }

}


type Props = {
  page: number,
  minPage: number
  maxPage: number
  onSet?: (page: number) => void
};
type State = {
  page: number
};