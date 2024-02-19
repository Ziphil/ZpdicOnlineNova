//

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {EnhancedDictionary} from "/client/skeleton/dictionary";
import {create} from "/client-new/component/create";


export const DictionarySettingFilePart = create(
  require("./dictionary-setting-file-part.scss"), "DictionarySettingFilePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("dictionarySettingFilePart");

    const {dictionary} = useOutletContext<{dictionary: EnhancedDictionary}>();

    return (
      <div styleName="root" {...rest}>
      </div>
    );

  }
);