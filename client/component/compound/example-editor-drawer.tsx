//

import {
  ReactElement, useEffect, useRef
} from "react";
import Drawer from "/client/component/atom/drawer";
import {
  DropdownPopperInstance
} from "/client/component/atom/dropdown";
import DropdownItem from "/client/component/atom/dropdown-item";
import Selection from "/client/component/atom/selection";
import ExampleEditor from "/client/component/compound/example-editor";
import {
  create
} from "/client/component/create";
import {
  useExampleEditorProps,
  useHotkey,
  useTrans
} from "/client/component/hook";
import {
  data
} from "/client/util/data";


const ExampleEditorDrawer = create(
  require("./example-editor-drawer.scss"), "ExampleEditorDrawer",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("exampleEditorDrawer");
    const {editorProps, editorOpen, setEditorOpen, editingId, setEditingId} = useExampleEditorProps();
    const popperRef = useRef<DropdownPopperInstance>(null);

    useHotkey("toggleExampleEditor", () => {
      setEditorOpen((exampleEditorOpen) => !exampleEditorOpen);
    }, []);

    useEffect(() => {
      if (editorProps.length <= 0) {
        setEditorOpen(false);
      }
    }, [editorProps.length, setEditorOpen]);

    const node = (
      <Drawer
        title={trans(":exampleEditor.title")}
        iconName="custom-example"
        badgeValue={(editorProps.length > 0) ? editorProps.length : undefined}
        tabPosition="bottom"
        open={editorOpen}
        onOpen={() => setEditorOpen(true)}
        onClose={() => setEditorOpen(false)}
        onTransitionEnd={() => popperRef.current?.update()}
        outsideClosable={true}
      >
        {(editorProps.length > 0) && (
          <>
            <div styleName="selection-container">
              <Selection label={trans("editing")} value={editingId} onSet={setEditingId} popperRef={popperRef}>
                {editorProps.map((editorProps) => (
                  <DropdownItem key={editorProps.id} value={editorProps.id}>{editorProps.name || trans("noName")}</DropdownItem>
                ))}
              </Selection>
            </div>
            <div styleName="editor-list">
              {editorProps.map((editorProps) => (
                <ExampleEditorDrawerEditor key={editorProps.id} editingId={editingId} editorProps={editorProps}/>
              ))}
            </div>
          </>
        )}
      </Drawer>
    );
    return node;

  }
);


const ExampleEditorDrawerEditor = create(
  require("./example-editor-drawer.scss"),
  function ({
    editingId,
    editorProps
  }: {
    editingId: string,
    editorProps: Parameters<typeof ExampleEditor>[0] & {id: string}
  }): ReactElement {

    const node = (
      <div styleName="editor-container" {...data({hidden: editingId !== editorProps.id})}>
        <ExampleEditor {...editorProps}/>
      </div>
    );
    return node;

  }
);


export default ExampleEditorDrawer;