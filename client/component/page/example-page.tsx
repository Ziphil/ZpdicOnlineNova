//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  useParams
} from "react-router-dom";
import {
  useMount
} from "react-use";
import ExampleList from "/client/component/compound/example-list";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useRequest
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  StyleNameUtil
} from "/client/util/style-name";


const ExamplePage = create(
  require("./example-page.scss"), "ExamplePage",
  function ({
  }: {
  }): ReactElement {

    let [dictionary, setDictionary] = useState<EnhancedDictionary | null>(null);
    let {request} = useRequest();
    let params = useParams<{value: string}>();

    let fetchDictionary = useCallback(async function (): Promise<void> {
      let value = params.value;
      let [number, paramName] = (() => {
        if (value.match(/^\d+$/)) {
          return [+value, undefined] as const;
        } else {
          return [undefined, value] as const;
        }
      })();
      let response = await request("fetchDictionary", {number, paramName});
      if (response.status === 200 && !("error" in response.data)) {
        let dictionary = EnhancedDictionary.enhance(response.data);
        setDictionary(dictionary);
      } else {
        setDictionary(null);
      }
    }, [params.value, request]);

    useMount(() => {
      fetchDictionary();
    });

    let node = (
      <Page>
        <div styleName="list">
          <ExampleList examples={[]} size={50}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default ExamplePage;