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
import Loading from "/client/component/compound/loading";
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

    let [dictionary, setDictionary] = useState<EnhancedDictionary | null>(null);
    let [examples, setExamples] = useState<Array<Example> | null>(null);
    let [canOwn, setCanOwn] = useState(false);
    let [canEdit, setCanEdit] = useState(false);
    let {request} = useRequest();
    let params = useParams<{number: string}>();

    let fetchDictionary = useCallback(async function (): Promise<void> {
      let number = +params.number;
      let response = await request("fetchDictionary", {number});
      if (response.status === 200 && !("error" in response.data)) {
        let dictionary = EnhancedDictionary.enhance(response.data);
        setDictionary(dictionary);
      } else {
        setDictionary(null);
      }
    }, [params.number, request]);

    let fetchExamples = useCallback(async function (): Promise<void> {
      let number = +params.number;
      let response = await request("fetchExamples", {number});
      if (response.status === 200 && !("error" in response.data)) {
        let examples = response.data[0];
        setExamples(examples);
      } else {
        setExamples(null);
      }
    }, [params.number, request]);

    let checkAuthorization = useCallback(async function (): Promise<void> {
      let number = +params.number;
      let ownPromise = (async () => {
        if (number !== undefined) {
          let authority = "own" as const;
          let response = await request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
          if (response.status === 200) {
            setCanOwn(true);
          }
        }
      })();
      let editPromise = (async () => {
        if (number !== undefined) {
          let authority = "edit" as const;
          let response = await request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
          if (response.status === 200) {
            setCanEdit(true);
          }
        }
      })();
      await Promise.all([ownPromise, editPromise]);
    }, [dictionary?.number, request]);

    useMount(() => {
      fetchDictionary();
      fetchExamples();
      checkAuthorization();
    });

    let node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={canEdit} showSettingLink={canOwn}>
        <Loading loading={dictionary === null || examples === null}>
          <div styleName="list">
            <ExampleList examples={examples} dictionary={dictionary!} size={40}/>
          </div>
        </Loading>
      </Page>
    );
    return node;

  }
);


export default ExamplePage;