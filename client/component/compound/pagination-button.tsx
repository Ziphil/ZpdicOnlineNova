//

import {
  ReactElement,
  useCallback
} from "react";
import Icon from "/client/component/atom/icon";
import {
  create
} from "/client/component/create";
import {
  useHotkey,
  useIntl,
  useMediaQuery
} from "/client/component/hook";


const PaginationButton = create(
  require("./pagination-button.scss"), "PaginationButton",
  function ({
    page,
    minPage,
    maxPage,
    size = 4,
    enableHotkeys = false,
    onSet
  }: {
    page: number,
    minPage: number,
    maxPage: number,
    size?: number,
    enableHotkeys?: boolean,
    onSet?: (page: number) => void
  }): ReactElement {

    const {smartphone} = useMediaQuery();
    const [, {transNumber}] = useIntl();

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

    useHotkey("movePreviousPage", () => {
      movePreviousPage();
    }, [movePreviousPage], enableHotkeys);
    useHotkey("moveNextPage", () => {
      moveNextPage();
    }, [moveNextPage], enableHotkeys);

    const actualSize = (smartphone) ? 1 : size;
    const node = (
      <div styleName="root">
        <div styleName="button-group leftmost">
          <button styleName="button" type="button" disabled={page <= minPage} onClick={movePreviousPage}>
            <Icon name="arrow-left"/>
          </button>
        </div>
        <div styleName="button-group left">
          {(page > minPage) && (
            <>
              <button styleName="button" type="button" onClick={() => movePage(minPage)}>
                {transNumber(minPage + 1)}
              </button>
              <div styleName="icon-container">
                <Icon name="ellipsis-h"/>
              </div>
            </>
          )}
          {calculateButtonSpecs(page, minPage, maxPage, actualSize, -1).map((spec) => (
            <button styleName="button" key={spec.page} type="button" onClick={() => movePage(spec.page)}>
              {transNumber(spec.page + 1)}
            </button>
          ))}
        </div>
        <div styleName="button-group center">
          <button styleName="button" type="button" disabled={true}>
            {transNumber(page + 1)}
          </button>
        </div>
        <div styleName="button-group right">
          {calculateButtonSpecs(page, minPage, maxPage, actualSize, 1).map((spec) => (
            <button styleName="button" key={spec.page} type="button" onClick={() => movePage(spec.page)}>
              {transNumber(spec.page + 1)}
            </button>
          ))}
          {(page < maxPage) && (
            <>
              <div styleName="icon-container">
                <Icon name="ellipsis-h"/>
              </div>
              <button styleName="button" type="button" onClick={() => movePage(maxPage)}>
                {transNumber(maxPage + 1)}
              </button>
            </>
          )}
        </div>
        <div styleName="button-group rightmost">
          <button styleName="button" type="button" disabled={page >= maxPage} onClick={moveNextPage}>
            <Icon name="arrow-right"/>
          </button>
        </div>
      </div>
    );
    return node;

  }
);


function calculateButtonSpecs(page: number, minPage: number, maxPage: number, size: number, direction: 1 | -1): Array<{page: number}> {
  const targetPage = (direction === -1) ? minPage : maxPage;
  const currentPage = page;
  const buttonSpecs = [];
  let difference = 2;
  for (let i = 0 ; i < size ; i ++) {
    const nextPage = currentPage + (difference - 1) * direction;
    if ((direction === -1 && nextPage > targetPage) || (direction === 1 && nextPage < targetPage)) {
      buttonSpecs.push({page: nextPage});
    } else {
      break;
    }
    difference *= 2;
  }
  if (direction === -1) {
    buttonSpecs.reverse();
  }
  return buttonSpecs;
};

export default PaginationButton;