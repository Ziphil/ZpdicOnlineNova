//

import {
  ReactElement
} from "react";
import Drawer from "/client/component/atom/drawer";
import ExampleEditor from "/client/component/compound/example-editor";
import {
  create
} from "/client/component/create";
import {
  useExampleEditorProps,
  useHotkey,
  useIntl
} from "/client/component/hook";


const ExampleEditorDrawer = create(
  require("./example-editor-drawer.scss"), "ExampleEditorDrawer",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {editorProps, editorOpen, setEditorOpen} = useExampleEditorProps();

    useHotkey("toggleExampleEditor", () => {
      setEditorOpen((exampleEditorOpen) => !exampleEditorOpen);
    }, []);

    const node = (
      <Drawer
        title={trans("exampleEditor.title")}
        iconName="custom-example"
        badgeValue={(editorProps.length > 0) ? editorProps.length : undefined}
        tabPosition="bottom"
        open={editorOpen}
        onOpen={() => setEditorOpen(true)}
        onClose={() => setEditorOpen(false)}
        outsideClosable={true}
      >
        {editorProps.map((editorProp) => (
          <ExampleEditor key={editorProp.id} {...editorProp}/>
        ))}
      </Drawer>
    );
    return node;

  }
);


export default ExampleEditorDrawer;