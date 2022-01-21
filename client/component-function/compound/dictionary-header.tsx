//

import downloadFile from "js-file-download";
import * as react from "react";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useState
} from "react";
import {
  useLocation
} from "react-router-dom";
import {
  useMount
} from "react-use";
import Button from "/client/component-function/atom/button";
import Dropdown from "/client/component-function/atom/dropdown";
import Link from "/client/component-function/atom/link";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePath,
  useRequest
} from "/client/component-function/hook";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


const DictionaryHeader = create(
  require("./dictionary-header.scss"), "DictionaryHeader",
  function ({
    dictionary,
    showAddLink = false,
    showAddCommissionLink = true,
    showSettingLink = false,
    showDownloadLink = true,
    preserveQuery = false
  }: {
    dictionary: EnhancedDictionary | null,
    showAddLink?: boolean,
    showAddCommissionLink?: boolean,
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
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="name">{nameNode}</div>
          </div>
          <div styleName="right">
            <DictionaryHeaderButtons {...{dictionary, showAddLink, showAddCommissionLink, showSettingLink, showDownloadLink, setWordEditorOpen, setExampleEditorOpen, setCommissionEditorOpen}}/>
          </div>
        </div>
        <DictionaryHeaderOverlays {...{dictionary, wordEditorOpen, exampleEditorOpen, commissionEditorOpen, setWordEditorOpen, setExampleEditorOpen, setCommissionEditorOpen}}/>
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
    showSettingLink,
    showDownloadLink,
    setWordEditorOpen,
    setExampleEditorOpen,
    setCommissionEditorOpen
  }: {
    dictionary: EnhancedDictionary | null,
    showAddLink: boolean,
    showAddCommissionLink: boolean,
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
        <Button label={trans("dictionaryHeader.add")} iconLabel="&#xF067;" style="simple" hideLabel={true}/>
      </Dropdown>
    );
    let addCommissionButtonNode = (showAddCommissionLink) && (
      <Button label={trans("dictionaryHeader.addCommission")} iconLabel="&#xF022;" style="simple" hideLabel={true} onClick={() => setCommissionEditorOpen(true)}/>
    );
    let settingButtonNode = (showSettingLink) && (
      <Button label={trans("dictionaryHeader.setting")} iconLabel="&#xF013;" style="simple" hideLabel={true} onClick={jumpSettingPage}/>
    );
    let downloadButtonNode = (showDownloadLink) && (
      <Button label={trans("dictionaryHeader.download")} iconLabel="&#xF019;" style="simple" hideLabel={true} onClick={downloadDictionary}/>
    );
    let node = (
      <div styleName="button">
        {settingButtonNode}
        {addButtonNode}
        {addCommissionButtonNode}
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

    let node = (
      <>{console.error("not implemented")}</>
    );
    return node;

  }
);


export default DictionaryHeader;