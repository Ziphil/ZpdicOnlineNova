//

import {
  ReactElement
} from "react";
import Drawer from "/client/component/atom/drawer";
import WordEditor from "/client/component/compound/word-editor-beta";
import {
  create
} from "/client/component/create";
import {
  useHotkey,
  useIntl,
  useWordEditorProps
} from "/client/component/hook";


const WordEditorDrawer = create(
  require("./word-editor-drawer.scss"), "WordEditorDrawer",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const [wordEditorProps, wordEditorOpen, setWordEditorOpen] = useWordEditorProps();

    useHotkey("toggleWordEditor", () => {
      setWordEditorOpen((wordEditorOpen) => !wordEditorOpen);
    }, []);

    const node = (
      <Drawer
        title={trans("wordEditor.title")}
        iconName="custom-word"
        badgeValue={(wordEditorProps.length > 0) ? wordEditorProps.length : undefined}
        tabPosition="top"
        open={wordEditorOpen}
        onOpen={() => setWordEditorOpen(true)}
        onClose={() => setWordEditorOpen(false)}
        outsideClosable={true}
      >
        {wordEditorProps.map((props) => (
          <WordEditor key={props.id} {...props}/>
        ))}
      </Drawer>
    );
    return node;

  }
);


export default WordEditorDrawer;