//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode,
  useState
} from "react";
import Drawer from "/client/component/atom/drawer";
import HotkeyHelp from "/client/component/compound/hotkey-help";
import WordEditor from "/client/component/compound/word-editor-beta";
import {
  create
} from "/client/component/create";
import {
  useHotkey,
  useIntl,
  usePath,
  useWordEditorProps
} from "/client/component/hook";


const InnerRoot = create(
  null, "InnerRoot",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    let [hotkeyHelpOpen, setHotkeyHelpOpen] = useState(false);
    let [{wordEditorProps, wordEditorOpen}, setWordEditorOpen] = useWordEditorProps();
    let [, {trans}] = useIntl();
    let {pushPath} = usePath();

    useHotkey("jumpDashboardPage", () => {
      pushPath("/dashboard");
    }, []);
    useHotkey("jumpDictionaryListPage", () => {
      pushPath("/list");
    }, []);
    useHotkey("jumpNotificationPage", () => {
      pushPath("/notification");
    }, []);
    useHotkey("jumpDocumentPage", () => {
      pushPath("/document");
    }, []);
    useHotkey("jumpContactPage", () => {
      pushPath("/contact");
    }, []);
    useHotkey("showHotkeyHelp", () => {
      setHotkeyHelpOpen(true);
    }, []);
    useHotkey("unfocus", () => {
      let activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }, []);

    let wordEditorNodes = wordEditorProps.map((props, index) => {
      let wordEditorNode = <WordEditor key={index} {...props}/>;
      return wordEditorNode;
    });
    let node = (
      <Fragment>
        {children}
        <Drawer open={wordEditorOpen} onOpen={() => setWordEditorOpen(true)} onClose={() => setWordEditorOpen(false)} outsideClosable={true} title={trans("wordEditor.title")}>
          {wordEditorNodes}
        </Drawer>
        <HotkeyHelp open={hotkeyHelpOpen} onClose={() => setHotkeyHelpOpen(false)}/>
      </Fragment>
    );
    return node;

  }
);


export default InnerRoot;