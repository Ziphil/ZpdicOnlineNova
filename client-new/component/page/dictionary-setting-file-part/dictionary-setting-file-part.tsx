//

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {EnhancedDictionary} from "/client/skeleton/dictionary";
import {create} from "/client-new/component/create";
import {DownloadDictionaryButton} from "/client-new/component/form/download-dictionary-button";
import {UploadDictionaryButton} from "/client-new/component/form/upload-dictionary-button";


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
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.upload")}</h3>
          <UploadDictionaryButton dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.download")}</h3>
          <DownloadDictionaryButton dictionary={dictionary}/>
        </section>
      </div>
    );

  }
);