//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  Suspense,
  lazy,
  useState
} from "react";
import Button from "/client/component/atom/button";
import WhitePane from "/client/component/compound/white-pane";
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
        <WhitePane clickable={false}>
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
        </WhitePane>
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