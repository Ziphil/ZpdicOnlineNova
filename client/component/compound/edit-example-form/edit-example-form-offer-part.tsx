//

import {ReactElement, useCallback, useState} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {ExampleOfferList} from "/client/component/compound/example-offer-list";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, ExampleOffer, NormalExampleOfferParameter} from "/client/skeleton";
import {calcOffsetSpec} from "/client/util/misc";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormOfferPart = create(
  require("./edit-example-form-offer-part.scss"), "EditExampleFormOfferPart",
  function ({
    dictionary,
    formSpec,
    setTabValue,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    formSpec: EditExampleSpec,
    setTabValue: (value: "edit" | "offer") => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {form} = formSpec;

    const [page, setPage] = useState(0);
    const [[offers, hitSize] = []] = useResponse("searchExampleOffers", {parameter: NormalExampleOfferParameter.EMPTY, ...calcOffsetSpec(page, 20)}, {keepPreviousData: true});

    const handleSelect = useCallback(function (offer: ExampleOffer): void {
      form.setValue("offer", offer.id);
      form.setValue("translation", offer.translation);
      setTabValue("edit");
    }, [form, setTabValue]);

    return (
      <div styleName="root" {...rest}>
        <ExampleOfferList offers={offers} pageSpec={{size: 40, hitSize, page, onPageSet: setPage}} showSelectButton={true} onSelect={handleSelect}/>
      </div>
    );

  }
);