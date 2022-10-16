//

import {
  Fragment,
  ReactElement,
  ReactNode,
  useState
} from "react";
import PaginationButton from "/client/component/compound/pagination-button";
import {
  create
} from "/client/component/create";
import {
  DataUtil
} from "/client/util/data";
import {
  slices
} from "/client/util/misc";


const PaneList = create(
  require("./pane-list-beta.scss"), "PaneList",
  function <T>({
    items,
    column = 1,
    method = "div",
    variant = "spaced",
    border = false,
    size,
    hitSize,
    page,
    onPageSet,
    showPagination = true,
    children
  }: {
    items: Array<T>,
    column?: number,
    method?: "div" | "table",
    variant?: "spaced" | "compact",
    border?: boolean,
    size: number,
    hitSize?: number,
    page?: number,
    onPageSet?: (page: number) => void,
    showPagination?: boolean,
    children: (item: T) => ReactNode
  }): ReactElement {

    const [innerPage, onInnerPageSet] = useState(0);

    const actualItems = (hitSize !== undefined && page !== undefined) ? items : items.slice(size * innerPage, size * innerPage + size);
    const actualHitSize = (hitSize !== undefined && page !== undefined) ? hitSize : items.length;
    const actualPage = (hitSize !== undefined && page !== undefined) ? page : innerPage;
    const actualOnPageSet = (hitSize !== undefined && page !== undefined) ? onPageSet : onInnerPageSet;
    const panesProps = {items: actualItems, column, variant, border, children};
    const node = (
      <div styleName="root">
        {(method === "div") ? (
          <PaneListDivPanes {...panesProps}/>
        ) : (
          <PaneListTablePanes {...panesProps}/>
        )}
        {(showPagination) && <PaneListPaginationButton {...{items: actualItems, size, hitSize: actualHitSize, page: actualPage, onPageSet: actualOnPageSet}}/>}
      </div>
    );
    return node;

  }
);


const PaneListDivPanes = create(
  require("./pane-list-beta.scss"),
  function <T>({
    items,
    column,
    variant,
    children
  }: {
    items: Array<T>,
    column: number,
    variant: "spaced" | "compact",
    children: (item: T) => ReactNode
  }): ReactElement {

    const data = DataUtil.create({variant});
    const node = (
      <div styleName="div-pane" style={{gridTemplateColumns: `repeat(${column}, 1fr)`}} {...data}>
        {items.map(children)}
      </div>
    );
    return node;

  }
);


const PaneListTablePanes = create(
  require("./pane-list-beta.scss"),
  function <T>({
    items,
    column,
    variant,
    border,
    children
  }: {
    items: Array<T>,
    column: number,
    variant: "spaced" | "compact",
    border: boolean,
    children: (item: T) => ReactNode
  }): ReactElement {

    const data = DataUtil.create({variant});
    const node = (
      <table styleName="table-pane" {...data}>
        <tbody>
          {slices(items, column, true).map((rowItems, index) => (
            <tr key={index}>
              {rowItems.map((item, index) => (
                <Fragment key={index}>
                  {(index !== 0) && (
                    <td styleName="spacer"/>
                  )}
                  {(border && index !== 0) && (
                    <td styleName="spacer border"/>
                  )}
                  <td>{(item !== undefined) ? children(item) : undefined}</td>
                </Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
    return node;

  }
);


const PaneListPaginationButton = create(
  require("./pane-list-beta.scss"),
  function <T>({
    items,
    size,
    hitSize,
    page,
    onPageSet
  }: {
    items: Array<T>,
    size: number,
    hitSize: number,
    page: number,
    onPageSet?: (page: number) => void
  }): ReactElement {

    const data = DataUtil.create({empty: items.length <= 0});
    const minPage = 0;
    const maxPage = Math.max(Math.ceil(hitSize / size) - 1, 0);
    const node = (
      <div styleName="pagination" {...data}>
        <PaginationButton page={page} minPage={minPage} maxPage={maxPage} onSet={onPageSet}/>
      </div>
    );
    return node;

  }
);


export default PaneList;