//

import downloadFile from "js-file-download";
import * as react from "react";
import {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  Suspense,
  lazy,
  useCallback,
  useState
} from "react";
import {
  useLocation
} from "react-router-dom";
import {
  useMount
} from "react-use";
import Button from "/client/component/atom/button";
import Dropdown from "/client/component/atom/dropdown";
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePath,
  useRequest
} from "/client/component/hook";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


let WordEditor = lazy(() => import("/client/component/compound/word-editor"));
let ExampleEditor = lazy(() => import("/client/component/compound/example-editor"));
let CommissionEditor = lazy(() => import("/client/component/compound/commission-editor"));


const DictionaryHeader = create(
  require("./dictionary-header.scss"), "DictionaryHeader",
  function ({
    dictionary,
    showAddLink = false,
    showAddCommissionLink = true,
    showExampleLink = true,
    showSettingLink = false,
    showDownloadLink = true,
    preserveQuery = false
  }: {
    dictionary: EnhancedDictionary | null,
    showAddLink?: boolean,
    showAddCommissionLink?: boolean,
    showExampleLink?: boolean,
    showSettingLink?: boolean,
    showDownloadLink?: boolean,
    preserveQuery?: boolean
  }): ReactElement {

    let location = useLocation<any>();
    let [wordEditorOpen, setWordEditorOpen] = useState(false);
    let [exampleEditorOpen, setExampleEditorOpen] = useState(false);
    let [commissionEditorOpen, setCommissionEditorOpen] = useState(false);

    useMount(() => {
      if (location.state?.openCommissionEditor) {
        setCommissionEditorOpen(true);
      }
    });

    let nameNode = (dictionary) && (() => {
      let href = "/dictionary/" + dictionary.number;
      if (preserveQuery) {
        let queryString = location!.search;
        href += queryString;
      }
      let nameNode = <Link href={href} target="self" style="plane">{dictionary.name}</Link>;
      return nameNode;
    })();
    let buttonsProps = {dictionary, showAddLink, showAddCommissionLink, showExampleLink, showSettingLink, showDownloadLink, setWordEditorOpen, setExampleEditorOpen, setCommissionEditorOpen};
    let overlaysProps = {dictionary, wordEditorOpen, exampleEditorOpen, commissionEditorOpen, setWordEditorOpen, setExampleEditorOpen, setCommissionEditorOpen};
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="name">{nameNode}</div>
          </div>
          <div styleName="right">
            <DictionaryHeaderButtons {...buttonsProps}/>
          </div>
        </div>
        <DictionaryHeaderOverlays {...overlaysProps}/>
      </header>
    );
    return node;

  }
);


const DictionaryHeaderButtons = create(
  require("./dictionary-header.scss"),
  function ({
    dictionary,
    showAddLink,
    showAddCommissionLink,
    showExampleLink,
    showSettingLink,
    showDownloadLink,
    setWordEditorOpen,
    setExampleEditorOpen,
    setCommissionEditorOpen
  }: {
    dictionary: EnhancedDictionary | null,
    showAddLink: boolean,
    showAddCommissionLink: boolean,
    showExampleLink: boolean,
    showSettingLink: boolean,
    showDownloadLink: boolean,
    setWordEditorOpen: Dispatch<SetStateAction<boolean>>,
    setExampleEditorOpen: Dispatch<SetStateAction<boolean>>,
    setCommissionEditorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

    let [, {trans}] = useIntl();
    let {pushPath} = usePath();
    let {request} = useRequest();

    let addSomething = useCallback(function (type: "word" | "example"): void {
      if (type === "word") {
        setWordEditorOpen(true);
      } else {
        setExampleEditorOpen(true);
      }
    }, [setWordEditorOpen, setExampleEditorOpen]);

    let jumpExamplePage = useCallback(function (): void {
      if (dictionary) {
        let path = "/example/" + dictionary.number;
        pushPath(path);
      }
    }, [dictionary, pushPath]);

    let jumpSettingPage = useCallback(function (): void {
      if (dictionary) {
        let path = "/dashboard/dictionary/" + dictionary.number;
        pushPath(path);
      }
    }, [dictionary, pushPath]);

    let downloadDictionary = useCallback(async function (): Promise<void> {
      if (dictionary) {
        let number = dictionary.number;
        let response = await request("downloadDictionary", {number}, {responseType: "blob"});
        if (response.status === 200 && !("error" in response.data)) {
          let data = response.data;
          let disposition = response.headers["content-disposition"];
          let match = disposition.match(/filename="(.+)"/);
          let encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
          let fileName = (() => {
            if (encodedMatch !== null) {
              return decodeURIComponent(encodedMatch[1]).replace(/\+/g, " ");
            } else if (match !== null) {
              return match[1];
            } else {
              return "dictionary.json";
            }
          })();
          downloadFile(data, fileName);
        }
      }
    }, [dictionary, request]);

    let addDropdownSpecs = [
      {value: "word", node: <DictionaryHeaderAddDropdown type="word"/>},
      {value: "example", node: <DictionaryHeaderAddDropdown type="example"/>}
    ] as const;
    let addButtonNode = (showAddLink) && (
      <Dropdown specs={addDropdownSpecs} showArrow={true} fillWidth={false} restrictHeight={false} autoMode="click" onSet={addSomething}>
        <Button label={trans("dictionaryHeader.add")} iconName="plus" style="simple" hideLabel={true}/>
      </Dropdown>
    );
    let addCommissionButtonNode = (showAddCommissionLink) && (
      <Button label={trans("dictionaryHeader.addCommission")} iconName="list-alt" style="simple" hideLabel={true} onClick={() => setCommissionEditorOpen(true)}/>
    );
    let exampleButtonNode = (showExampleLink) && (
      <Button label={trans("dictionaryHeader.example")} iconName="file-alt" style="simple" hideLabel={true} onClick={jumpExamplePage}/>
    );
    let settingButtonNode = (showSettingLink) && (
      <Button label={trans("dictionaryHeader.setting")} iconName="cog" style="simple" hideLabel={true} onClick={jumpSettingPage}/>
    );
    let downloadButtonNode = (showDownloadLink) && (
      <Button label={trans("dictionaryHeader.download")} iconName="download" style="simple" hideLabel={true} onClick={downloadDictionary}/>
    );
    let node = (
      <div styleName="button">
        {settingButtonNode}
        {addButtonNode}
        {addCommissionButtonNode}
        {exampleButtonNode}
        {downloadButtonNode}
      </div>
    );
    return node;

  }
);


const DictionaryHeaderAddDropdown = create(
  require("./dictionary-header.scss"),
  function ({
    type
  }: {
    type: "word" | "example"
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <div>
        <span styleName="icon">{(type === "word") ? "\uF1C2" : "\uF15C"}</span>
        {trans(`dictionaryHeader.add${type.charAt(0).toUpperCase() + type.slice(1)}`)}
      </div>
    );
    return node;

  }
);


const DictionaryHeaderOverlays = create(
  require("./dictionary-header.scss"),
  function ({
    dictionary,
    wordEditorOpen,
    exampleEditorOpen,
    commissionEditorOpen,
    setWordEditorOpen,
    setExampleEditorOpen,
    setCommissionEditorOpen
  }: {
    dictionary: EnhancedDictionary | null,
    wordEditorOpen: boolean,
    exampleEditorOpen: boolean,
    commissionEditorOpen: boolean,
    setWordEditorOpen: Dispatch<SetStateAction<boolean>>,
    setExampleEditorOpen: Dispatch<SetStateAction<boolean>>,
    setCommissionEditorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

    let wordEditorNode = (dictionary !== null && wordEditorOpen) && (
      <Suspense fallback="">
        <WordEditor dictionary={dictionary} word={null} open={wordEditorOpen} onClose={() => setWordEditorOpen(false)}/>
      </Suspense>
    );
    let exampleEditorNode = (dictionary !== null && exampleEditorOpen) && (
      <Suspense fallback="">
        <ExampleEditor dictionary={dictionary} example={null} open={exampleEditorOpen} onClose={() => setExampleEditorOpen(false)}/>
      </Suspense>
    );
    let commissionEditorNode = (dictionary !== null && commissionEditorOpen) && (
      <Suspense fallback="">
        <CommissionEditor dictionary={dictionary} open={commissionEditorOpen} onClose={() => setCommissionEditorOpen(false)}/>
      </Suspense>
    );
    let node = (
      <Fragment>
        {wordEditorNode}
        {exampleEditorNode}
        {commissionEditorNode}
      </Fragment>
    );
    return node;

  }
);


export default DictionaryHeader;