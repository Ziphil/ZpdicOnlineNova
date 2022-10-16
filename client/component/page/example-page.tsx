//

import {
  ReactElement,
  useState
} from "react";
import ExampleList from "/client/component/compound/example-list";
import {
  create
} from "/client/component/create";
import {
  useParams,
  useSuspenseQuery
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  calcOffset
} from "/client/util/misc";


const ExamplePage = create(
  require("./example-page.scss"), "ExamplePage",
  function ({
  }: {
  }): ReactElement {

    const params = useParams();

    const number = +params.number;
    const [page, setPage] = useState(0);
    const [dictionary] = useSuspenseQuery("fetchDictionary", {number}, {}, EnhancedDictionary.enhance);
    const [[hitExamples, hitSize]] = useSuspenseQuery("fetchExamples", {number, ...calcOffset(page, 40)}, {keepPreviousData: true});
    const [canOwn] = useSuspenseQuery("fetchDictionaryAuthorization", {number, authority: "own"});
    const [canEdit] = useSuspenseQuery("fetchDictionaryAuthorization", {number, authority: "edit"});

    const node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={canEdit} showSettingLink={canOwn}>
        <div styleName="list">
          <ExampleList examples={hitExamples} dictionary={dictionary} size={40} hitSize={hitSize} page={page} onPageSet={setPage}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default ExamplePage;