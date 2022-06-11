//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import RadioGroup from "/client/component/atom/radio-group";
import DictionaryList from "/client/component/compound/dictionary-list";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useRequest
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  DetailedDictionary
} from "/client/skeleton/dictionary";
import {
  WithSize
} from "/server/controller/internal/type";


const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
  }: {
  }): ReactElement {

    const [order, setOrder] = useState("updatedDate");
    const [, {trans}] = useIntl();
    const {request} = useRequest();

    const provideDictionaries = useCallback(async function (offset?: number, size?: number): Promise<WithSize<DetailedDictionary>> {
      const response = await request("fetchAllDictionaries", {order, offset, size});
      if (response.status === 200) {
        const hitResult = response.data;
        return hitResult;
      } else {
        return [[], 0];
      }
    }, [order, request]);

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
          <DictionaryList dictionaries={provideDictionaries} showCreatedDate={true} size={20}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default DictionaryListPage;