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
import PaneList from "/client/component/compound/pane-list";
import {
  create
} from "/client/component/create";
import {
  Dictionary,
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
    dictionary?: Dictionary,
    size: number,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let renderExample = useCallback(function (example: Example): ReactNode {
      return <>{example.sentence} → {example.translation}</>;
    }, []);

    let node = (
      <PaneList items={examples} size={size} column={2} renderer={renderExample}/>
    );
    return node;

  }
);


export default ExampleList;