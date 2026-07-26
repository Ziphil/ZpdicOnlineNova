/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, Select, SelectOption, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useSearchForm} from "/client/hook/search-form";
import {preventDefault} from "/client/util/form";
import {ExampleOfferParameter} from "/server/internal/skeleton";


export const SearchExampleOfferForm = create(
  require("./search-example-offer-form.scss"), "SearchExampleOfferForm",
  function ({
    parameter,
    onParameterCommit,
    ...rest
  }: {
    parameter: ExampleOfferParameter,
    onParameterCommit: (parameter: ExampleOfferParameter) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchExampleOfferForm");

    const {form} = useSearchForm({parameter, debouncedNames: [], toFormValue, fromFormValue, onCommit: onParameterCommit});
    const {control} = form;

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Controller name="catalog" control={control} render={({field}) => (
          <Select value={field.value} onSet={field.onChange}>
            {CATALOGS.map((catalog) => (
              <SelectOption key={catalog} value={catalog} label={trans(`:exampleOfferTag.catalog.${catalog}`)}>
                {trans(`:exampleOfferTag.catalog.${catalog}`)}
              </SelectOption>
            ))}
          </Select>
        )}/>
      </form>
    );

  }
);


const CATALOGS = ["zpdicDaily", "appleAlpha", "appleBeta", "appleGamma", "survival", "weaving", "shaleianAlpha", "shaleianBeta", "meat", "arithmetic", "adposition"];

function toFormValue(parameter: ExampleOfferParameter): SearchExampleOfferFormValue {
  const value = {
    catalog: parameter.catalog
  } satisfies SearchExampleOfferFormValue;
  return value;
}

function fromFormValue(value: SearchExampleOfferFormValue): ExampleOfferParameter {
  const parameter = {
    kind: "normal",
    catalog: value.catalog
  } satisfies ExampleOfferParameter;
  return parameter;
}

type SearchExampleOfferFormValue = {
  catalog: string | null
};
