//

import downloadFile from "js-file-download";
import * as react from "react";
import {
  Dispatch,
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
import Button from "/client/component/atom/button";
import Dropdown from "/client/component/atom/dropdown";
import Icon from "/client/component/atom/icon";
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";
import {
  useExampleEditor,
  useHotkey,
  useIntl,
  useLocation,
  usePath,
  useRequest,
  useWordEditor
} from "/client/component/hook";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


const CommissionEditor = lazy(() => import("/client/component/compound/commission-editor"));


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

    const [commissionEditorOpen, setCommissionEditorOpen] = useState(false);
    const addWordEditor = useWordEditor();
    const addExampleEditor = useExampleEditor();
    const {pushPath} = usePath();
    const location = useLocation();

    const openWordEditor = useCallback(function (): void {
      if (dictionary !== null) {
        addWordEditor({dictionary, word: null});
      }
    }, [dictionary, addWordEditor]);

    const openExampleEditor = useCallback(function (): void {
      if (dictionary !== null) {
        addExampleEditor({dictionary, example: null});
      }
    }, [dictionary, addExampleEditor]);

    const hotkeyEnabled = dictionary !== null;
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
      openExampleEditor();
    }, [openExampleEditor], hotkeyEnabled && showAddLink);
    useHotkey("addCommission", () => {
      setCommissionEditorOpen(true);
    }, [], hotkeyEnabled && showAddCommissionLink);

    const nameNode = (dictionary) && (() => {
      let href = "/dictionary/" + dictionary.number;
      if (preserveQuery) {
        href += location.searchString;
      }
      const nameNode = <Link href={href} target="self" style="plane">{dictionary.name}</Link>;
      return nameNode;
    })();
    const buttonsProps = {dictionary, showAddLink, showAddCommissionLink, showExampleLink, showSettingLink, showDownloadLink, openWordEditor, openExampleEditor, setCommissionEditorOpen};
    const overlaysProps = {dictionary, commissionEditorOpen, setCommissionEditorOpen};
    const node = (
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
    openExampleEditor,
    setCommissionEditorOpen
  }: {
    dictionary: EnhancedDictionary | null,
    showAddLink: boolean,
    showAddCommissionLink: boolean,
    showExampleLink: boolean,
    showSettingLink: boolean,
    showDownloadLink: boolean,
    openWordEditor: () => void,
    openExampleEditor: () => void,
    setCommissionEditorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {pushPath} = usePath();
    const {request} = useRequest();

    const openEditor = useCallback(function (type: "word" | "example"): void {
      if (type === "word") {
        openWordEditor();
      } else {
        openExampleEditor();
      }
    }, [openWordEditor, openExampleEditor]);

    const jumpExamplePage = useCallback(function (): void {
      if (dictionary) {
        const path = "/example/" + dictionary.number;
        pushPath(path);
      }
    }, [dictionary, pushPath]);

    const jumpSettingPage = useCallback(function (): void {
      if (dictionary) {
        const path = "/dashboard/dictionary/" + dictionary.number;
        pushPath(path);
      }
    }, [dictionary, pushPath]);

    const downloadDictionary = useCallback(async function (): Promise<void> {
      if (dictionary) {
        const number = dictionary.number;
        const response = await request("downloadDictionary", {number}, {responseType: "blob"});
        if (response.status === 200 && !("error" in response.data)) {
          const data = response.data;
          const disposition = response.headers["content-disposition"];
          const match = disposition.match(/filename="(.+)"/);
          const encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
          const fileName = (() => {
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

    const addDropdownSpecs = [
      {value: "word", node: <DictionaryHeaderAddDropdownNode type="word"/>},
      {value: "example", node: <DictionaryHeaderAddDropdownNode type="example"/>}
    ] as const;
    const addButtonNode = (showAddLink) && (
      <Dropdown specs={addDropdownSpecs} showArrow={true} fillWidth={false} restrictHeight={false} autoMode="click" onSet={openEditor}>
        <Button label={trans("dictionaryHeader.add")} iconName="plus" variant="simple" hideLabel={true}/>
      </Dropdown>
    );
    const addCommissionButtonNode = (showAddCommissionLink) && (
      <Button label={trans("dictionaryHeader.addCommission")} iconName="list-check" variant="simple" hideLabel={true} onClick={() => setCommissionEditorOpen(true)}/>
    );
    const exampleButtonNode = (showExampleLink) && (
      <Button label={trans("dictionaryHeader.example")} iconName="custom-example" variant="simple" hideLabel={true} onClick={jumpExamplePage}/>
    );
    const settingButtonNode = (showSettingLink) && (
      <Button label={trans("dictionaryHeader.setting")} iconName="cog" variant="simple" hideLabel={true} onClick={jumpSettingPage}/>
    );
    const downloadButtonNode = (showDownloadLink) && (
      <Button label={trans("dictionaryHeader.download")} iconName="download" variant="simple" hideLabel={true} onClick={downloadDictionary}/>
    );
    const node = (
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

    const [, {trans}] = useIntl();

    const node = (
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
    commissionEditorOpen,
    setCommissionEditorOpen
  }: {
    dictionary: EnhancedDictionary | null,
    commissionEditorOpen: boolean,
    setCommissionEditorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement | null {

    const node = (dictionary !== null && commissionEditorOpen) && (
      <Suspense fallback="">
        <CommissionEditor dictionary={dictionary} open={commissionEditorOpen} onClose={() => setCommissionEditorOpen(false)}/>
      </Suspense>
    );
    return node || null;

  }
);


export default DictionaryHeader;