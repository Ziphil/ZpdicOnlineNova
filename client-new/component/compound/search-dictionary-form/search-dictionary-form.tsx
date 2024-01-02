//

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, Input, InputAddon} from "zographia";
import {create} from "/client-new/component/create";


export const SearchDictionaryForm = create(
  require("./search-dictionary-form.scss"), "SearchDictionaryForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const node = (
      <form styleName="root" {...rest}>
        <Input styleName="input" type="search">
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <div styleName="row">
        </div>
      </form>
    );
    return node;

  }
);