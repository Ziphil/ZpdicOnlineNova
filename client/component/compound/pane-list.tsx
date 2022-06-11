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
import Loading from "/client/component/compound/loading";
import PaginationButton from "/client/component/compound/pagination-button";
import {
  create
} from "/client/component/create";
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

    const [page, setPage] = useState(0);
    const [hitResult, setHitResult] = useState<WithSize<T>>([[], 0]);
    const [loading, setLoading] = useState(false);

    const handlePageSet = useCallback(async function (page: number): Promise<void> {
      const offset = size * page;
      if (typeof items === "function") {
        setLoading(true);
        const hitResult = await items(offset, size);
        setPage(page);
        setHitResult(hitResult);
        setLoading(false);
      } else {
        if (items !== null) {
          const hitItems = items.slice(offset, offset + size);
          const hitSize = items.length;
          const hitResult = [hitItems, hitSize] as WithSize<T>;
          setPage(page);
          setHitResult(hitResult);
          setLoading(false);
        } else {
          setLoading(true);
        }
      }
    }, [items, size]);

    useEffect(() => {
      handlePageSet(page);
    }, [items]);

    const panesProps = {renderer, column, style, border, hitResult};
    const panes = (method === "div") ? <PaneListDivPanes {...panesProps}/> : <PaneListTablePanes {...panesProps}/>;
    const pagenationButtonNode = (showPagination) && <PaneListPaginationButton {...{size, page, hitResult, handlePageSet}}/>;
    const node = (
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

    const [hitItems, hitSize] = hitResult;
    const styleName = StyleNameUtil.create(
      "div-pane",
      {if: style === "spaced", true: "spaced"}
    );
    const panes = hitItems.map(renderer);
    const node = (
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

    const [hitItems, hitSize] = hitResult;
    const styleName = StyleNameUtil.create(
      "table-pane",
      {if: style === "spaced", true: "spaced"}
    );
    const rowPanes = slices(hitItems, column, true).map((rowItems, index) => {
      const cellPanes = rowItems.map((item, index) => {
        const innerPane = (item !== undefined) ? renderer(item) : undefined;
        const spacerNode = (index !== 0) && (
          <td styleName="spacer"/>
        );
        const borderSpacerNode = (border && index !== 0) && (
          <td styleName="spacer border"/>
        );
        const cellPane = (
          <Fragment key={index}>
            {spacerNode}
            {borderSpacerNode}
            <td>{innerPane}</td>
          </Fragment>
        );
        return cellPane;
      });
      const rowPane = <tr key={index}>{cellPanes}</tr>;
      return rowPane;
    });
    const node = (
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

    const [hitItems, hitSize] = hitResult;
    const maxPage = Math.max(Math.ceil(hitSize / size) - 1, 0);
    const styleName = StyleNameUtil.create(
      "pagination",
      {if: hitItems.length <= 0, true: "empty"}
    );
    const node = (
      <div styleName={styleName}>
        <PaginationButton page={page} minPage={0} maxPage={maxPage} onSet={(page) => handlePageSet(page)}/>
      </div>
    );
    return node;

  }
);


export type ItemProvider<T> = (offset?: number, size?: number) => Promise<WithSize<T>>;

export default PaneList;