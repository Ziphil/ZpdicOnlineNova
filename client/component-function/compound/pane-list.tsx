//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";
import Loading from "/client/component-function/compound/loading";
import PaginationButton from "/client/component-function/compound/pagination-button";
import {
  create
} from "/client/component-function/create";
import {
  slices
} from "/client/util/misc";
import {
  StyleNameUtil
} from "/client/util/style-name";
import {
  WithSize
} from "/server/controller/internal/type";


const PaneList = create(
  require("./pane-list.scss"), "PaneList",
  function <T>({
    items,
    renderer,
    column = 1,
    size,
    method = "div",
    style = "spaced",
    border = false,
    showPagination = true
  }: {
    items: Array<T> | ItemProvider<T> | null,
    renderer: (item: T) => ReactNode,
    column?: number,
    size: number,
    method?: "div" | "table",
    style?: "spaced" | "compact",
    border?: boolean,
    showPagination?: boolean
  }): ReactElement {

    let [page, setPage] = useState(0);
    let [hitResult, setHitResult] = useState<WithSize<T>>([[], 0]);
    let [loading, setLoading] = useState(false);

    useEffect(() => {
      handlePageSet(page);
    }, [items]);

    let handlePageSet = useCallback(async function (page: number): Promise<void> {
      let offset = size * page;
      if (typeof items === "function") {
        setLoading(true);
        let hitResult = await items(offset, size);
        setPage(page);
        setHitResult(hitResult);
        setLoading(false);
      } else {
        if (items !== null) {
          let hitItems = items.slice(offset, offset + size);
          let hitSize = items.length;
          let hitResult = [hitItems, hitSize] as WithSize<T>;
          setPage(page);
          setHitResult(hitResult);
          setLoading(false);
        } else {
          setLoading(true);
        }
      }
    }, [items, size]);

    let panesProps = {renderer, column, style, border, hitResult};
    let panes = (method === "div") ? <PaneListDivPanes {...panesProps}/> : <PaneListTablePanes {...panesProps}/>;
    let pagenationButtonNode = (showPagination) && <PaneListPaginationButton {...{size, page, hitResult, handlePageSet}}/>;
    let node = (
      <div styleName="root">
        <Loading loading={loading}>
          {panes}
          {pagenationButtonNode}
        </Loading>
      </div>
    );
    return node;

  }
);


const PaneListDivPanes = create(
  require("./pane-list.scss"),
  function <T>({
    renderer,
    column,
    style,
    hitResult
  }: {
    renderer: (item: T) => ReactNode,
    column: number,
    style: "spaced" | "compact",
    hitResult: WithSize<T>
  }): ReactElement {

    let [hitItems, hitSize] = hitResult;
    let styleName = StyleNameUtil.create(
      "div-pane",
      {if: style === "spaced", true: "spaced"}
    );
    let panes = hitItems.map(renderer);
    let node = (
      <div styleName={styleName} style={{gridTemplateColumns: `repeat(${column}, 1fr)`}}>
        {panes}
      </div>
    );
    return node;

  }
);


const PaneListTablePanes = create(
  require("./pane-list.scss"),
  function <T>({
    renderer,
    column,
    style,
    border,
    hitResult
  }: {
    renderer: (item: T) => ReactNode,
    column: number,
    style: "spaced" | "compact",
    border: boolean,
    hitResult: WithSize<T>
  }): ReactElement {

    let [hitItems, hitSize] = hitResult;
    let styleName = StyleNameUtil.create(
      "table-pane",
      {if: style === "spaced", true: "spaced"}
    );
    let rowPanes = slices(hitItems, column, true).map((rowItems, index) => {
      let cellPanes = rowItems.map((item, index) => {
        let innerPane = (item !== undefined) ? renderer(item) : undefined;
        let spacerNode = (index !== 0) && (
          <td styleName="spacer"/>
        );
        let borderSpacerNode = (border && index !== 0) && (
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
);


const PaneListPaginationButton = create(
  require("./pane-list.scss"),
  function <T>({
    size,
    page,
    hitResult,
    handlePageSet
  }: {
    size: number,
    page: number,
    hitResult: WithSize<T>,
    handlePageSet: (page: number) => Promise<void>
  }): ReactElement {

    let [hitItems, hitSize] = hitResult;
    let maxPage = Math.max(Math.ceil(hitSize / size) - 1, 0);
    let styleName = StyleNameUtil.create(
      "pagination",
      {if: hitItems.length <= 0, true: "empty"}
    );
    let node = (
      <div styleName={styleName}>
        <PaginationButton page={page} minPage={0} maxPage={maxPage} onSet={(page) => handlePageSet(page)}/>
      </div>
    );
    return node;

  }
);


export type ItemProvider<T> = (offset?: number, size?: number) => Promise<WithSize<T>>;

export default PaneList;