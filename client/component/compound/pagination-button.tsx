//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import Icon from "/client/component/atom/icon";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useHotkey,
  useMediaQuery
} from "/client/component/hook";


const PaginationButton = create(
  require("./pagination-button.scss"), "PaginationButton",
  function ({
    page,
    minPage,
    maxPage,
    enableHotkeys = false,
    onSet,
    styles
  }: {
    page: number,
    minPage: number
    maxPage: number,
    enableHotkeys?: boolean,
    onSet?: (page: number) => void,
    styles?: StylesRecord
  }): ReactElement {

    const {smartphone} = useMediaQuery();

    const movePage = useCallback(function (page: number): void {
      onSet?.(page);
    }, [onSet]);

    const movePreviousPage = useCallback(function (): void {
      let movedPage = page - 1;
      if (movedPage < minPage) {
        movedPage = minPage;
      }
      movePage(movedPage);
    }, [page, minPage, movePage]);

    const moveNextPage = useCallback(function (): void {
      let movedPage = page + 1;
      if (movedPage > maxPage) {
        movedPage = maxPage;
      }
      movePage(movedPage);
    }, [page, maxPage, movePage]);

    const calculateButtonSpecs = useCallback(function (direction: 1 | -1): Array<{page: number}> {
      const targetPage = (direction === -1) ? minPage : maxPage;
      const currentPage = page;
      const buttonSpecs = [];
      let difference = 2;
      const size = (smartphone) ? 1 : 4;
      for (let i = 0 ; i < size ; i ++) {
        const nextPage = currentPage + (difference - 1) * direction;
        if ((direction === -1 && nextPage > targetPage) || (direction === 1 && nextPage < targetPage)) {
          buttonSpecs.push({page: nextPage});
        } else {
          break;
        }
        difference *= 2;
      }
      return buttonSpecs;
    }, [page, minPage, maxPage, smartphone]);

    const createButtonNode = useCallback(function (specs: Array<{page: number}>, direction: 1 | -1): Array<ReactNode> {
      const buttonNodes = specs.map((spec, index) => {
        const position = (() => {
          if (direction === 1) {
            if (index === specs.length - 1) {
              return "right" as const;
            } else {
              return "middle" as const;
            }
          } else {
            if (index === 0) {
              return "left" as const;
            } else {
              return "middle" as const;
            }
          }
        })();
        const buttonNode = (
          <Button className={styles!["desktop"]} key={spec.page} label={(spec.page + 1).toString()} position={position} onClick={() => movePage(spec.page)}/>
        );
        return buttonNode;
      });
      return buttonNodes;
    }, [movePage, styles]);

    useHotkey("movePreviousPage", () => {
      movePreviousPage();
    }, [movePreviousPage], enableHotkeys);
    useHotkey("moveNextPage", () => {
      moveNextPage();
    }, [moveNextPage], enableHotkeys);

    const leftButtonSpecs = calculateButtonSpecs(-1).reverse();
    const rightButtonSpecs = calculateButtonSpecs(1);
    const leftButtonNodes = createButtonNode(leftButtonSpecs, -1);
    const rightButtonNodes = createButtonNode(rightButtonSpecs, 1);
    const centerButtonPosition = (() => {
      if (leftButtonSpecs.length === 0 && rightButtonSpecs.length === 0) {
        return "alone" as const;
      } else if (leftButtonSpecs.length > 0 && rightButtonSpecs.length === 0) {
        return "right" as const;
      } else if (leftButtonSpecs.length === 0 && rightButtonSpecs.length > 0) {
        return "left" as const;
      } else {
        return "middle" as const;
      }
    })();
    const minPageButtonNode = (page > minPage) && (
      <Fragment>
        <Button label={(minPage + 1).toString()} onClick={() => movePage(minPage)}/>
        <div styleName="icon">
          <Icon name="ellipsis-h"/>
        </div>
      </Fragment>
    );
    const maxPageButtonNode = (page < maxPage) && (
      <Fragment>
        <div styleName="icon">
          <Icon name="ellipsis-h"/>
        </div>
        <Button label={(maxPage + 1).toString()} onClick={() => movePage(maxPage)}/>
      </Fragment>
    );
    const node = (
      <div styleName="root">
        <div styleName="button leftmost">
          <Button iconName="arrow-left" disabled={page <= minPage} onClick={movePreviousPage}/>
        </div>
        <div styleName="button left">
          {minPageButtonNode}
          {leftButtonNodes}
        </div>
        <div styleName="button center">
          <Button label={(page + 1).toString()} position={centerButtonPosition} disabled={true}/>
        </div>
        <div styleName="button right">
          {rightButtonNodes}
          {maxPageButtonNode}
        </div>
        <div styleName="button rightmost">
          <Button iconName="arrow-right" disabled={page >= maxPage} onClick={moveNextPage}/>
        </div>
      </div>
    );
    return node;

  }
);


export default PaginationButton;