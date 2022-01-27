//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import ExamplePane from "/client/component/compound/example-pane";
import PaneList from "/client/component/compound/pane-list";
import {
  create
} from "/client/component/create";
import {
  EnhancedDictionary,
  Example
} from "/client/skeleton/dictionary";


const ExampleList = create(
  require("./example-list.scss"), "ExampleList",
  function ({
    examples,
    dictionary,
    size,
    onSubmit
  }: {
    examples: Array<Example> | null,
    dictionary: EnhancedDictionary,
    size: number,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let renderExample = useCallback(function (example: Example): ReactNode {
      let node = (
        <ExamplePane example={example} dictionary={dictionary}/>
      );
      return node;
    }, [dictionary]);

    let node = (
      <PaneList items={examples} size={size} column={2} method="table" style="spaced" border={true} renderer={renderExample}/>
    );
    return node;

  }
);


export default ExampleList;