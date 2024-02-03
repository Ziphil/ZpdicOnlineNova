//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListPagination} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary, Example} from "/client-new/skeleton";
import {ExampleCard} from "./example-card";


export const ExampleList = create(
  require("./example-list.scss"), "ExampleList",
  function ({
    dictionary,
    examples,
    size,
    hitSize,
    page,
    onPageSet,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    examples: Array<Example>,
    size: number,
    hitSize?: number,
    page?: number,
    onPageSet?: (page: number) => unknown,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={examples} size={size} hitSize={hitSize} page={page} onPageSet={onPageSet} {...rest}>
        <ListBody styleName="body">
          {(example) => <ExampleCard key={dictionary.id} dictionary={dictionary} example={example}/>}
          <ListEmptyView/>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);