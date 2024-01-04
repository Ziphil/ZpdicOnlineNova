//

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, Input, InputAddon} from "zographia";
import {OrderDirectionSelect} from "/client-new/component/compound/order-direction-select";
import {OrderModeSelect} from "/client-new/component/compound/order-mode-select";
import {create} from "/client-new/component/create";
import {preventDefault} from "/client-new/util/form";


export const SearchDictionaryForm = create(
  require("./search-dictionary-form.scss"), "SearchDictionaryForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const node = (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Input styleName="input" type="search">
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <div styleName="row">
          <OrderModeSelect orderMode="updatedDate" orderModeOptions={["createdDate", "updatedDate"]}/>
          <OrderDirectionSelect orderDirection="ascending"/>
        </div>
      </form>
    );
    return node;

  }
);