//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  useMount
} from "react-use";
import ExampleList from "/client/component/compound/example-list";
import Loading from "/client/component/compound/loading";
import {
  create
} from "/client/component/create";
import {
  useParams,
  useRequest
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  EnhancedDictionary,
  Example
} from "/client/skeleton/dictionary";


const ExamplePage = create(
  require("./example-page.scss"), "ExamplePage",
  function ({
  }: {
  }): ReactElement {

    const [dictionary, setDictionary] = useState<EnhancedDictionary | null>(null);
    const [examples, setExamples] = useState<Array<Example> | null>(null);
    const [canOwn, setCanOwn] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const {request} = useRequest();
    const params = useParams();

    const fetchDictionary = useCallback(async function (): Promise<void> {
      const number = +params.number;
      const response = await request("fetchDictionary", {number});
      if (response.status === 200 && !("error" in response.data)) {
        const dictionary = EnhancedDictionary.enhance(response.data);
        setDictionary(dictionary);
      } else {
        setDictionary(null);
      }
    }, [params.number, request]);

    const fetchExamples = useCallback(async function (): Promise<void> {
      const number = +params.number;
      const response = await request("fetchExamples", {number});
      if (response.status === 200 && !("error" in response.data)) {
        const examples = response.data[0];
        setExamples(examples);
      } else {
        setExamples(null);
      }
    }, [params.number, request]);

    const checkAuthorization = useCallback(async function (): Promise<void> {
      const number = +params.number;
      const ownPromise = (async () => {
        if (number !== undefined) {
          const authority = "own" as const;
          const response = await request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
          if (response.status === 200) {
            setCanOwn(true);
          }
        }
      })();
      const editPromise = (async () => {
        if (number !== undefined) {
          const authority = "edit" as const;
          const response = await request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
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

    const node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={canEdit} showSettingLink={canOwn}>
        <Loading loading={dictionary === null || examples === null}>
          <div styleName="list">
            <ExampleList examples={examples} dictionary={dictionary!} size={40} onEditConfirm={fetchExamples} onDiscardConfirm={fetchExamples}/>
          </div>
        </Loading>
      </Page>
    );
    return node;

  }
);


export default ExamplePage;