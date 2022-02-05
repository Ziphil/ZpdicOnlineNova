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
  Helmet
} from "react-helmet";
import {
  useLocation
} from "react-router-dom";
import {
  useMount
} from "react-use";
import Button from "/client/component/atom/button";
import Dropdown from "/client/component/atom/dropdown";
import Icon from "/client/component/atom/icon";
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";
import {
  useHotkey,
  useIntl,
  usePath,
  useRequest,
  useWordEditor
} from "/client/component/hook";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


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

    let [exampleEditorOpen, setExampleEditorOpen] = useState(false);
    let [commissionEditorOpen, setCommissionEditorOpen] = useState(false);
    let addWordEditor = useWordEditor();
    let {pushPath} = usePath();
    let location = useLocation<any>();

    let openWordEditor = useCallback(function (): void {
      if (dictionary !== null) {
        addWordEditor({dictionary, word: null});
      }
    }, [dictionary, addWordEditor]);

    useMount(() => {
      if (location.state?.openCommissionEditor) {
        setCommissionEditorOpen(true);
      }
    });

    let hotkeyEnabled = dictionary !== null;
    useHotkey("jumpDictionaryPage", () => {
      pushPath("/dictionary/" + dictionary?.number);
    }, [dictionary?.number], hotkeyEnabled);
    useHotkey("jumpDictionarySettingPage", () => {
      pushPath("/dashboard/dictionary/" + dictionary?.number);
    }, [dictionary?.number], hotkeyEnabled);
    useHotkey("jumpExamplePage", () => {
      pushPath("/example/" + dictionary?.number);
    }, [dictionary?.number], hotkeyEnabled);
    useHotkey("addWord", () => {
      openWordEditor();
    }, [openWordEditor], hotkeyEnabled && showAddLink);
    useHotkey("addExample", () => {
      setExampleEditorOpen(true);
    }, [], hotkeyEnabled && showAddLink);
    useHotkey("addCommission", () => {
      setCommissionEditorOpen(true);
    }, [], hotkeyEnabled && showAddCommissionLink);

    let nameNode = (dictionary) && (() => {
      let href = "/dictionary/" + dictionary.number;
      if (preserveQuery) {
        let queryString = location!.search;
        href += queryString;
      }
      let nameNode = <Link href={href} target="self" style="plane">{dictionary.name}</Link>;
      return nameNode;
    })();
    let buttonsProps = {dictionary, showAddLink, showAddCommissionLink, showExampleLink, showSettingLink, showDownloadLink, openWordEditor, setExampleEditorOpen, setCommissionEditorOpen};
    let overlaysProps = {dictionary, exampleEditorOpen, commissionEditorOpen, setExampleEditorOpen, setCommissionEditorOpen};
    let node = (
      <header styleName="root">
        <Helmet>
          <title>{(dictionary) ? `${dictionary.name} — ZpDIC Online` : "ZpDIC Online"}</title>
        </Helmet>
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
    openWordEditor,
    setExampleEditorOpen,
    setCommissionEditorOpen
  }: {
    dictionary: EnhancedDictionary | null,
    showAddLink: boolean,
    showAddCommissionLink: boolean,
    showExampleLink: boolean,
    showSettingLink: boolean,
    showDownloadLink: boolean,
    openWordEditor: () => void,
    setExampleEditorOpen: Dispatch<SetStateAction<boolean>>,
    setCommissionEditorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

    let [, {trans}] = useIntl();
    let {pushPath} = usePath();
    let {request} = useRequest();

    let addSomething = useCallback(function (type: "word" | "example"): void {
      if (type === "word") {
        openWordEditor();
      } else {
        setExampleEditorOpen(true);
      }
    }, [openWordEditor, setExampleEditorOpen]);

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
      {value: "word", node: <DictionaryHeaderAddDropdownNode type="word"/>},
      {value: "example", node: <DictionaryHeaderAddDropdownNode type="example"/>}
    ] as const;
    let addButtonNode = (showAddLink) && (
      <Dropdown specs={addDropdownSpecs} showArrow={true} fillWidth={false} restrictHeight={false} autoMode="click" onSet={addSomething}>
        <Button label={trans("dictionaryHeader.add")} iconName="plus" style="simple" hideLabel={true}/>
      </Dropdown>
    );
    let addCommissionButtonNode = (showAddCommissionLink) && (
      <Button label={trans("dictionaryHeader.addCommission")} iconName="list-check" style="simple" hideLabel={true} onClick={() => setCommissionEditorOpen(true)}/>
    );
    let exampleButtonNode = (showExampleLink) && (
      <Button label={trans("dictionaryHeader.example")} iconName="custom-example" style="simple" hideLabel={true} onClick={jumpExamplePage}/>
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


const DictionaryHeaderAddDropdownNode = create(
  require("./dictionary-header.scss"),
  function ({
    type
  }: {
    type: "word" | "example"
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <div>
        <span styleName="icon"><Icon name={(type === "word") ? "custom-word" : "custom-example"}/></span>
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
    exampleEditorOpen,
    commissionEditorOpen,
    setExampleEditorOpen,
    setCommissionEditorOpen
  }: {
    dictionary: EnhancedDictionary | null,
    exampleEditorOpen: boolean,
    commissionEditorOpen: boolean,
    setExampleEditorOpen: Dispatch<SetStateAction<boolean>>,
    setCommissionEditorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

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
        {exampleEditorNode}
        {commissionEditorNode}
      </Fragment>
    );
    return node;

  }
);


export default DictionaryHeader;