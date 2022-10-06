//

import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import Radio from "/client/component/atom/radio";
import RadioGroup from "/client/component/atom/radio-group";
import DictionaryList from "/client/component/compound/dictionary-list";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useMediaQuery,
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
    const {smartphone} = useMediaQuery();

    const [order, setOrder] = useState("updatedDate");
    const [page, setPage] = useState(0);
    const [[hitDictionaries, hitSize]] = useSuspenseQuery("fetchAllDictionaries", {order, ...calcOffset(page, 20)}, {keepPreviousData: true});

    const column = (smartphone) ? 1 : 2;
    const node = (
      <Page title={trans("dictionaryListPage.title")}>
        <div styleName="search-form-container">
          <RadioGroup name="order" value={order} onSet={(order) => setOrder(order)}>
            <Radio value="updatedDate" label={trans("dictionaryListPage.updatedDate")}/>
            <Radio value="createdDate" label={trans("dictionaryListPage.createdDate")}/>
          </RadioGroup>
        </div>
        <div styleName="list">
          <DictionaryList dictionaries={hitDictionaries} column={column} size={20} hitSize={hitSize} page={page} onPageSet={setPage} showCreatedDate={true}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default DictionaryListPage;