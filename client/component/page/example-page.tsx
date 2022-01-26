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
  EnhancedDictionary,
  Example
} from "/client/skeleton/dictionary";
import {
  StyleNameUtil
} from "/client/util/style-name";


const ExamplePage = create(
  require("./example-page.scss"), "ExamplePage",
  function ({
  }: {
  }): ReactElement {

    let [examples, setExamples] = useState<Array<Example> | null>(null);
    let {request} = useRequest();
    let params = useParams<{number: string}>();

    let fetchDictionary = useCallback(async function (): Promise<void> {
      let number = +params.number;
      let response = await request("fetchExamples", {number});
      if (response.status === 200 && !("error" in response.data)) {
        let examples = response.data[0];
        setExamples(examples);
      } else {
        setExamples(null);
      }
    }, [params.number, request]);

    useMount(() => {
      fetchDictionary();
    });

    let node = (
      <Page>
        <div styleName="list">
          <ExampleList examples={examples} size={50}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default ExamplePage;