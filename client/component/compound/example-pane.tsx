//

import {
  MouseEvent,
  ReactElement,
  useCallback
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
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
  EditableExample,
  EnhancedDictionary,
  Example
} from "/client/skeleton/dictionary";


const ExamplePane = create(
  require("./example-pane.scss"), "ExamplePane",
  function ({
    example,
    dictionary,
    onEditConfirm,
    onDiscardConfirm
  }: {
    example: Example,
    dictionary: EnhancedDictionary,
    onEditConfirm?: (example: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>
  }): ReactElement {

    const addExampleEditor = useExampleEditor();
    const [, {trans}] = useIntl();

    const openEditor = useCallback(function (): void {
      addExampleEditor({dictionary, example, onEditConfirm, onDiscardConfirm});
    }, [dictionary, example, onEditConfirm, onDiscardConfirm, addExampleEditor]);

    const node = (
      <WhitePane clickable={false}>
        <div styleName="example-container">
          <div styleName="example">
            <span styleName="sentence">{example.sentence}</span>
            <span styleName="example-separator"/>
            <span styleName="translation">{example.translation}</span>
          </div>
          {(example.words.length <= 0) && (
            <div styleName="caution">
              {trans("examplePane.caution")}
            </div>
          )}
        </div>
        <div styleName="button-container">
          <Button label={trans("examplePane.edit")} iconName="edit" variant="simple" onClick={openEditor}/>
        </div>
      </WhitePane>
    );
    return node;

  }
);


export default ExamplePane;