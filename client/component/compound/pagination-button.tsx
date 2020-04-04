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
    this.movePage(page);
  }

  private moveNextPage(): void {
    let page = this.state.page + 1;
    if (page > this.props.maxPage) {
      page = this.props.maxPage;
    }
    this.movePage(page);
  }

  private movePage(page: number): void {
    this.setState({page});
    if (this.props.onSet) {
      this.props.onSet(page);
    }
  }

  public render(): ReactNode {
    let outerThis = this;
    let calculateButtonSpecs = function (direction: "left" | "right"): Array<{page: number}> {
      let targetPage = (direction === "left") ? outerThis.props.minPage : outerThis.props.maxPage;
      let currentPage = targetPage;
      let pages = [];
      let specs = [];
      for (let i = 0 ; i < 3 ; i ++) {
        let roundedCurrentPage = Math.round(currentPage);
        if (pages.indexOf(roundedCurrentPage) < 0 && roundedCurrentPage !== outerThis.state.page) {
          pages.push(roundedCurrentPage);
          specs.push({page: roundedCurrentPage});
        }
        currentPage = (currentPage + outerThis.state.page) / 2;
      }
      for (let i = 1 ; i >= 1 ; i --) {
        let nextPage = (direction === "left") ? outerThis.state.page - i : outerThis.state.page + i;
        if (pages.indexOf(nextPage) < 0 && ((direction === "left" && nextPage > targetPage) || (direction === "right" && nextPage < targetPage))) {
          pages.push(nextPage);
          specs.push({page: nextPage});
        }
      }
      return specs;
    };
    let buttonSpecs = [];
    buttonSpecs.push(...calculateButtonSpecs("left"));
    buttonSpecs.push({page: this.state.page, current: true});
    buttonSpecs.push(...calculateButtonSpecs("right").reverse());
    let buttonNodes = buttonSpecs.map((spec, index) => {
      let position = "middle" as "alone" | "left" | "right" | "middle";
      if (index === 0 && index === buttonSpecs.length - 1) {
        position = "alone";
      } else if (index === 0) {
        position = "left";
      } else if (index === buttonSpecs.length - 1) {
        position = "right";
      }
      let buttonNode = (
        <div>
          <Button label={(spec.page + 1).toString()} position={position} key={index} onClick={() => this.movePage(spec.page)}/>
        </div>
      );
      return buttonNode;
    });
    let node = (
      <div styleName="root">
        <Button label="&#xF060;" usesIcon={true} disabled={this.state.page <= this.props.minPage} onClick={this.movePreviousPage.bind(this)}/>
        {buttonNodes}
        <Button label="&#xF061;" usesIcon={true} disabled={this.state.page >= this.props.maxPage} onClick={this.moveNextPage.bind(this)}/>
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