/* eslint-disable react/jsx-closing-bracket-location */

import {Dispatch, ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps, Select, SelectOption, useTrans} from "zographia";
import {create} from "/client/component/create";
import {ExampleOfferParameter} from "/client/skeleton";
import {preventDefault} from "/client/util/form";


export const SearchExampleOfferForm = create(
  require("./search-example-offer-form.scss"), "SearchExampleOfferForm",
  function ({
    parameter,
    onParameterSet,
    ...rest
  }: {
    parameter: ExampleOfferParameter,
    onParameterSet?: Dispatch<SetStateAction<ExampleOfferParameter>>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchExampleOfferForm");

    const handlePositionNameSet = useCallback(function (positionName: string | null): void {
      onParameterSet?.((prevParameter) => {
        return {...prevParameter, catalog: positionName};
      });
    }, [onParameterSet]);

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Select value={parameter.catalog} onSet={handlePositionNameSet}>
          {CATALOGS.map((catalog) => (
            <SelectOption key={catalog} value={catalog} label={trans(`:exampleOfferTag.catalog.${catalog}`)}>
              {trans(`:exampleOfferTag.catalog.${catalog}`)}
            </SelectOption>
          ))}
        </Select>
      </form>
    );

  }
);


const CATALOGS = ["zpdicDaily", "appleAlpha", "appleBeta"];