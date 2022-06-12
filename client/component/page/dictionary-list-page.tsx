//

import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import RadioGroup from "/client/component/atom/radio-group";
import DictionaryList from "/client/component/compound/dictionary-list";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useSuspenseQuery
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  calcOffset
} from "/client/util/misc";


const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();

    const [order, setOrder] = useState("updatedDate");
    const [page, setPage] = useState(0);
    const [[hitDictionaries, hitSize]] = useSuspenseQuery("fetchAllDictionaries", {order, ...calcOffset(page, 20)}, {keepPreviousData: true});

    const specs = [
      {value: "updatedDate", label: trans("dictionaryListPage.updatedDate")},
      {value: "createdDate", label: trans("dictionaryListPage.createdDate")}
    ];
    const node = (
      <Page title={trans("dictionaryListPage.title")}>
        <div styleName="search-form-container">
          <RadioGroup name="order" value={order} specs={specs} onSet={(order) => setOrder(order)}/>
        </div>
        <div styleName="list">
          <DictionaryList dictionaries={hitDictionaries} size={20} hitSize={hitSize} page={page} onPageSet={setPage} showCreatedDate={true}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default DictionaryListPage;