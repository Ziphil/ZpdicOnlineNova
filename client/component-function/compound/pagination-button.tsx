//

import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component-function/atom/button";
import {
  create
} from "/client/component-function/create";


const PaginationButton = create(
  require("./pagination-button.scss"), "PaginationButton",
  function ({
    page,
    minPage,
    maxPage,
    onSet
  }: {
    page: number,
    minPage: number
    maxPage: number
    onSet?: (page: number) => void
  }): ReactElement {

    let movePage = useCallback(function (page: number): void {
      onSet?.(page);
    }, [onSet]);

    let movePreviousPage = useCallback(function (): void {
      let movedPage = page - 1;
      if (movedPage < minPage) {
        movedPage = minPage;
      }
      movePage(movedPage);
    }, [page, minPage, movePage]);

    let moveNextPage = useCallback(function (): void {
      let movedPage = page + 1;
      if (movedPage > maxPage) {
        movedPage = maxPage;
      }
      movePage(movedPage);
    }, [page, maxPage, movePage]);

    let calculateButtonSpecs = useCallback(function (direction: 1 | -1): Array<{page: number, redundant: boolean, current: boolean}> {
      let targetPage = (direction === -1) ? minPage : maxPage;
      let currentPage = page;
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
    }, [page, minPage, maxPage]);

    let wholeButtonSpecs = [
      ...calculateButtonSpecs(-1).reverse(),
      {page, redundant: false, current: true},
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
          <Button label={(spec.page + 1).toString()} position={position} disabled={disabled} onClick={() => movePage(spec.page)}/>
        </div>
      );
      return buttonNode;
    });
    let node = (
      <div styleName="root">
        <Button iconLabel="&#xF060;" disabled={page <= minPage} onClick={movePreviousPage}/>
        <div styleName="button-group">
          {buttonNodes}
        </div>
        <Button iconLabel="&#xF061;" disabled={page >= maxPage} onClick={moveNextPage}/>
      </div>
    );
    return node;

  }
);


export default PaginationButton;