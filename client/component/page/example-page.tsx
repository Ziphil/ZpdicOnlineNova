//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useMemo,
  useState
} from "react";
import {
  useMount
} from "react-use";
import ExampleList from "/client/component/compound/example-list";
import {
  create
} from "/client/component/create";
import {
  useParams,
  useRequest,
  useSuspenseQuery
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


const ExamplePage = create(
  require("./example-page.scss"), "ExamplePage",
  function ({
  }: {
  }): ReactElement {

    const {request} = useRequest();
    const params = useParams();

    const number = +params.number;
    const [rawDictionary] = useSuspenseQuery("fetchDictionary", {number});
    const [[examples]] = useSuspenseQuery("fetchExamples", {number});
    const dictionary = useMemo(() => EnhancedDictionary.enhance(rawDictionary), [rawDictionary]);
    const [canOwn, setCanOwn] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    const checkAuthorization = useCallback(async function (): Promise<void> {
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
    }, [number, request]);

    useMount(() => {
      checkAuthorization();
    });

    const node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={canEdit} showSettingLink={canOwn}>
        <div styleName="list">
          <ExampleList examples={examples} dictionary={dictionary} size={40}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default ExamplePage;