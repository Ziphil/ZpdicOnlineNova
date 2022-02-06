//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import WhitePane from "/client/component/compound/white-pane";
import {
  create
} from "/client/component/create";
import {
  useExampleEditor,
  useIntl
} from "/client/component/hook";
import {
  EnhancedDictionary,
  Example
} from "/client/skeleton/dictionary";


const ExamplePane = create(
  require("./example-pane.scss"), "ExamplePane",
  function ({
    example,
    dictionary
  }: {
    example: Example,
    dictionary: EnhancedDictionary
  }): ReactElement {

    let addExampleEditor = useExampleEditor();
    let [, {trans}] = useIntl();

    let openEditor = useCallback(function (): void {
      addExampleEditor({dictionary, example});
    }, [dictionary, example, addExampleEditor]);

    let cautionNode = (example.words.length <= 0) && (
      <div styleName="caution">
        {trans("examplePane.caution")}
      </div>
    );
    let node = (
      <WhitePane clickable={false}>
        <div styleName="example-wrapper">
          <div styleName="example">
            <span styleName="sentence">{example.sentence}</span>
            <span styleName="example-separator"/>
            <span styleName="translation">{example.translation}</span>
          </div>
          {cautionNode}
        </div>
        <div styleName="button">
          <Button label={trans("examplePane.edit")} iconName="edit" style="simple" onClick={openEditor}/>
        </div>
      </WhitePane>
    );
    return node;

  }
);


export default ExamplePane;