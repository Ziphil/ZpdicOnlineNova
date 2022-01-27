//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactElement,
  ReactNode,
  Suspense,
  lazy,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import {
  EnhancedDictionary,
  Example
} from "/client/skeleton/dictionary";


let ExampleEditor = lazy(() => import("/client/component/compound/example-editor"));


const ExamplePane = create(
  require("./example-pane.scss"), "ExamplePane",
  function ({
    example,
    dictionary
  }: {
    example: Example,
    dictionary: EnhancedDictionary
  }): ReactElement {

    let [editorOpen, setEditorOpen] = useState(false);
    let [, {trans}] = useIntl();

    let node = (
      <Fragment>
        <div styleName="root">
          <div styleName="example-wrapper">
            <div styleName="example">
              <span styleName="sentence">{example.sentence}</span>
              <span styleName="example-separator"/>
              <span styleName="translation">{example.translation}</span>
            </div>
          </div>
          <div styleName="button">
            <Button label={trans("examplePane.edit")} iconName="edit" style="simple" onClick={() => setEditorOpen(true)}/>
          </div>
        </div>
        <Suspense fallback="">
          <ExampleEditor
            dictionary={dictionary}
            example={example}
            open={editorOpen}
            onClose={() => setEditorOpen(false)}
          />
        </Suspense>
      </Fragment>
    );
    return node;

  }
);


export default ExamplePane;