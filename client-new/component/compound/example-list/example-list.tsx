//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListPagination, PageSpec} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary, Example} from "/client-new/skeleton";
import {ExampleCard} from "./example-card";


export const ExampleList = create(
  require("./example-list.scss"), "ExampleList",
  function ({
    dictionary,
    examples,
    pageSpec,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    examples: Array<Example>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={examples} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(example) => <ExampleCard key={example.id} dictionary={dictionary} example={example}/>}
          <ListEmptyView/>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);