//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Example} from "/client/skeleton";
import {ExampleCard} from "./example-card";


export const ExampleList = create(
  require("./example-list.scss"), "ExampleList",
  function ({
    dictionary,
    examples,
    pageSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    examples: Array<Example>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("exampleList");

    return (
      <List styleName="root" items={examples} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(example) => <ExampleCard key={example.id} dictionary={dictionary} example={example}/>}
          <ListLoadingView/>
          <ListEmptyView>
            {trans("empty")}
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);