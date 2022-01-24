//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import RadioGroup from "/client/component-function/atom/radio-group";
import DictionaryList from "/client/component-function/compound/dictionary-list";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";
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

    let [order, setOrder] = useState("updatedDate");
    let [, {trans}] = useIntl();
    let {request} = useRequest();

    let provideDictionaries = useCallback(async function (offset?: number, size?: number): Promise<WithSize<DetailedDictionary>> {
      let response = await request("fetchAllDictionaries", {order, offset, size});
      if (response.status === 200) {
        let hitResult = response.data;
        return hitResult;
      } else {
        return [[], 0];
      }
    }, [order, request]);

    let specs = [
      {value: "updatedDate", label: trans("dictionaryListPage.updatedDate")},
      {value: "createdDate", label: trans("dictionaryListPage.createdDate")}
    ];
    let node = (
      <Page>
        <div styleName="search-form">
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