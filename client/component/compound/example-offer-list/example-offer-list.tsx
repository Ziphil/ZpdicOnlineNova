//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {EnhancedDictionary, ExampleOffer} from "/client/skeleton";
import {ExampleOfferCard} from "./example-offer-card";


export const ExampleOfferList = create(
  require("./example-offer-list.scss"), "ExampleOfferList",
  function ({
    dictionary,
    offers,
    pageSpec,
    showPagination = true,
    showExamples = false,
    ...rest
  }: {
    dictionary?: EnhancedDictionary,
    offers?: Array<ExampleOffer>,
    pageSpec: PageSpec,
    showPagination?: boolean,
    showExamples?: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("exampleOfferList");

    return (
      <List styleName="root" items={offers} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(example) => (
            <ExampleOfferCard
              key={example.id}
              dictionary={dictionary}
              offer={example}
              showExamples={showExamples}
            />
          )}
          <ListLoadingView/>
        </ListBody>
        {(showPagination) && (
          <ListPagination styleName="pagination"/>
        )}
      </List>
    );

  }
);