//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, ExampleOffer} from "/client/skeleton";
import {ExampleOfferCard} from "./example-offer-card";


export const ExampleOfferList = create(
  require("./example-offer-list.scss"), "ExampleOfferList",
  function ({
    dictionary,
    offers,
    pageSpec,
    headerType = "tag",
    showPagination = true,
    showSupplement = false,
    showExamples = false,
    showSelectButton = false,
    onSelect,
    ...rest
  }: {
    dictionary?: DictionaryWithExecutors,
    offers?: Array<ExampleOffer>,
    pageSpec: PageSpec,
    headerType?: "tag" | "date",
    showPagination?: boolean,
    showSupplement?: boolean,
    showExamples?: boolean,
    showSelectButton?: boolean,
    onSelect?: (offer: ExampleOffer) => void,
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
              headerType={headerType}
              showSupplement={showSupplement}
              showExamples={showExamples}
              showSelectButton={showSelectButton}
              onSelect={onSelect}
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