//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode
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
    renderer,
    column = 1,
    method = "div",
    variant = "spaced",
    border = false,
    size,
    hitSize,
    page,
    onPageSet,
    showPagination = true
  }: {
    items: Array<T>,
    renderer: (item: T) => ReactNode,
    column?: number,
    method?: "div" | "table",
    variant?: "spaced" | "compact",
    border?: boolean,
    size: number,
    hitSize: number,
    page: number,
    onPageSet?: (page: number) => void,
    showPagination?: boolean
  }): ReactElement {

    let panesProps = {items, renderer, column, variant, border};
    let node = (
      <div styleName="root">
        {(method === "div") ? (
          <PaneListDivPanes {...panesProps}/>
        ) : (
          <PaneListTablePanes {...panesProps}/>
        )}
        {(showPagination) && <PaneListPaginationButton {...{items, size, hitSize, page, onPageSet}}/>}
      </div>
    );
    return node;

  }
);


const PaneListDivPanes = create(
  require("./pane-list-beta.scss"),
  function <T>({
    items,
    renderer,
    column,
    variant
  }: {
    items: Array<T>,
    renderer: (item: T) => ReactNode,
    column: number,
    variant: "spaced" | "compact"
  }): ReactElement {

    let data = DataUtil.create({variant});
    let node = (
      <div styleName="div-pane" style={{gridTemplateColumns: `repeat(${column}, 1fr)`}} {...data}>
        {items.map(renderer)}
      </div>
    );
    return node;

  }
);


const PaneListTablePanes = create(
  require("./pane-list-beta.scss"),
  function <T>({
    items,
    renderer,
    column,
    variant,
    border
  }: {
    items: Array<T>,
    renderer: (item: T) => ReactNode,
    column: number,
    variant: "spaced" | "compact",
    border: boolean
  }): ReactElement {

    let data = DataUtil.create({variant});
    let node = (
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
                  <td>{(item !== undefined) ? renderer(item) : undefined}</td>
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
    onPageSet?: (page: number) => void,
  }): ReactElement {

    let data = DataUtil.create({empty: items.length <= 0});
    let minPage = 0;
    let maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    let node = (
      <div styleName="pagination" {...data}>
        <PaginationButton page={page} minPage={minPage} maxPage={maxPage} onSet={onPageSet}/>
      </div>
    );
    return node;

  }
);


export default PaneList;