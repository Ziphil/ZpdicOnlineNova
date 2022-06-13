//

import partial from "lodash-es/partial";
import * as react from "react";
import {
  MouseEvent,
  ReactElement
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import ExamplePane from "/client/component/compound/example-pane";
import PaneList from "/client/component/compound/pane-list-beta";
import {
  create
} from "/client/component/create";
import {
  EditableExample,
  EnhancedDictionary,
  Example
} from "/client/skeleton/dictionary";


const ExampleList = create(
  require("./example-list.scss"), "ExampleList",
  function ({
    examples,
    dictionary,
    size,
    hitSize,
    page,
    onPageSet,
    onEditConfirm,
    onDiscardConfirm
  }: {
    examples: Array<Example>,
    dictionary: EnhancedDictionary,
    size: number,
    hitSize?: number,
    page?: number,
    onPageSet?: (page: number) => void,
    onEditConfirm?: (oldExample: Example, newExample: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>,
    onDiscardConfirm?: (example: Example, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>
  }): ReactElement {

    const node = (
      <PaneList
        items={examples}
        column={2}
        size={size}
        hitSize={hitSize}
        page={page}
        onPageSet={onPageSet}
        renderer={(example) => (
          <ExamplePane
            key={example.id}
            example={example}
            dictionary={dictionary}
            onEditConfirm={onEditConfirm && partial(onEditConfirm, example)}
            onDiscardConfirm={onDiscardConfirm && partial(onDiscardConfirm, example)}
          />
        )}
      />
    );
    return node;

  }
);


export default ExampleList;