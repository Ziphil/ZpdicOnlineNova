//

import {
  ReactElement,
  useState
} from "react";
import Drawer from "/client/component/atom/drawer";
import DropdownItem from "/client/component/atom/dropdown-item";
import Selection from "/client/component/atom/selection";
import WordEditor from "/client/component/compound/word-editor-beta";
import {
  create
} from "/client/component/create";
import {
  useHotkey,
  useIntl,
  useWordEditorProps
} from "/client/component/hook";
import {
  DataUtil
} from "/client/util/data";


const WordEditorDrawer = create(
  require("./word-editor-drawer.scss"), "WordEditorDrawer",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const [editorProps, editorOpen, setEditorOpen] = useWordEditorProps();

    const [editingId, setEditingId] = useState<string>("");

    useHotkey("toggleWordEditor", () => {
      setEditorOpen((wordEditorOpen) => !wordEditorOpen);
    }, []);

    const node = (
      <Drawer
        title={trans("wordEditor.title")}
        iconName="custom-word"
        badgeValue={(editorProps.length > 0) ? editorProps.length : undefined}
        tabPosition="top"
        open={editorOpen}
        onOpen={() => setEditorOpen(true)}
        onClose={() => setEditorOpen(false)}
        outsideClosable={true}
      >
        {(editorProps.length > 0) && (
          <>
            <div styleName="selection-container">
              <Selection label={trans("wordEditorDrawer.editing")} value={editingId} onSet={setEditingId}>
                {editorProps.map((editorProps) => (
                  <DropdownItem key={editorProps.id} value={editorProps.id}>{editorProps.id}</DropdownItem>
                ))}
              </Selection>
            </div>
            <div styleName="editor-list">
              {editorProps.map((editorProps) => (
                <WordEditorDrawerEditor key={editorProps.id} editingId={editingId} editorProps={editorProps}/>
              ))}
            </div>
          </>
        )}
      </Drawer>
    );
    return node;

  }
);


const WordEditorDrawerEditor = create(
  require("./word-editor-drawer.scss"),
  function ({
    editingId,
    editorProps
  }: {
    editingId: string,
    editorProps: Parameters<typeof WordEditor>[0] & {id: string}
  }): ReactElement {

    const data = DataUtil.create({
      hidden: editingId !== editorProps.id
    });
    const node = (
      <div styleName="editor-container" {...data}>
        <WordEditor {...editorProps}/>
      </div>
    );
    return node;

  }
);


export default WordEditorDrawer;