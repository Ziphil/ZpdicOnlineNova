//

import {
  ReactElement
} from "react";
import Drawer from "/client/component/atom/drawer";
import ExampleEditor from "/client/component/compound/example-editor-beta";
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
    const [exampleEditorProps, exampleEditorOpen, setExampleEditorOpen] = useExampleEditorProps();

    useHotkey("toggleExampleEditor", () => {
      setExampleEditorOpen((exampleEditorOpen) => !exampleEditorOpen);
    }, []);

    const node = (
      <Drawer
        title={trans("exampleEditor.title")}
        iconName="custom-example"
        badgeValue={(exampleEditorProps.length > 0) ? exampleEditorProps.length : undefined}
        tabPosition="bottom"
        open={exampleEditorOpen}
        onOpen={() => setExampleEditorOpen(true)}
        onClose={() => setExampleEditorOpen(false)}
        outsideClosable={true}
      >
        {exampleEditorProps.map((props) => (
          <ExampleEditor key={props.id} {...props}/>
        ))}
      </Drawer>
    );
    return node;

  }
);


export default ExampleEditorDrawer;