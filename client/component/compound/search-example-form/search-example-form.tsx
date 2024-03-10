//

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, Input, InputAddon, MultiLineText, useTrans} from "zographia";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";


export const SearchExampleForm = create(
  require("./search-example-form.scss"), "SearchExampleForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchExampleForm");

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Input styleName="input" type="search" disabled={true}>
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <MultiLineText styleName="information" lineHeight="narrow">
          {trans("information")}
        </MultiLineText>
      </form>
    );

  }
);