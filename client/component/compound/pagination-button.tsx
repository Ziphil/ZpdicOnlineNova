//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./pagination-button.scss"))
export default class PaginationButton extends Component<Props, State> {

  private movePreviousPage(): void {
    let page = this.props.page - 1;
    if (page < this.props.minPage) {
      page = this.props.minPage;
    }
    this.movePage(page);
  }

  private moveNextPage(): void {
    let page = this.props.page + 1;
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
    let calculateButtonSpecs = function (direction: 1 | -1): Array<{page: number, redundant: boolean, current: boolean}> {
      let targetPage = (direction === -1) ? outerThis.props.minPage : outerThis.props.maxPage;
      let currentPage = outerThis.props.page;
      let buttonSpecs = [];
      let difference = 2;
      for (let i = 0 ; i < 4 ; i ++) {
        let nextPage = currentPage + (difference - 1) * direction;
        if ((direction === -1 && nextPage > targetPage) || (direction === 1 && nextPage < targetPage)) {
          let redundant = i > 0;
          buttonSpecs.push({page: nextPage, redundant, current: false});
        }
        difference *= 2;
      }
      if ((direction === -1 && currentPage !== targetPage) || (direction === 1 && currentPage !== targetPage)) {
        buttonSpecs.push({page: targetPage, redundant: false, current: false});
      }
      return buttonSpecs;
    };
    let wholeButtonSpecs = [
      ...calculateButtonSpecs(-1).reverse(),
      {page: this.props.page, redundant: false, current: true},
      ...calculateButtonSpecs(1)
    ];
    let buttonNodes = wholeButtonSpecs.map((spec, index) => {
      let position = (() => {
        if (index === 0 && index === wholeButtonSpecs.length - 1) {
          return "alone" as const;
        } else if (index === 0) {
          return "left" as const;
        } else if (index === wholeButtonSpecs.length - 1) {
          return "right" as const;
        } else {
          return "middle" as const;
        }
      })();
      let disabled = spec.current;
      let styleName = (spec.redundant) ? "redundant" : "";
      let buttonNode = (
        <div styleName={styleName} key={index}>
          <Button label={(spec.page + 1).toString()} position={position} disabled={disabled} onClick={() => this.movePage(spec.page)}/>
        </div>
      );
      return buttonNode;
    });
    let node = (
      <div styleName="root">
        <Button iconLabel="&#xF060;" disabled={this.props.page <= this.props.minPage} onClick={this.movePreviousPage.bind(this)}/>
        <div styleName="button-group">
          {buttonNodes}
        </div>
        <Button iconLabel="&#xF061;" disabled={this.props.page >= this.props.maxPage} onClick={this.moveNextPage.bind(this)}/>
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
};