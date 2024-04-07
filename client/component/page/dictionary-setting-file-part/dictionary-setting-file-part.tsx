//

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";
import {DownloadDictionaryButton} from "/client/component/form/download-dictionary-button";
import {UploadDictionaryButton} from "/client/component/form/upload-dictionary-button";
import {DictionaryWithExecutors} from "/client/skeleton";


export const DictionarySettingFilePart = create(
  require("./dictionary-setting-file-part.scss"), "DictionarySettingFilePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("dictionarySettingFilePart");

    const {dictionary} = useOutletContext<{dictionary: DictionaryWithExecutors}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.upload")}</h3>
          <MultiLineText styleName="description">
            {trans("description.upload")}
          </MultiLineText>
          <UploadDictionaryButton dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.download")}</h3>
          <MultiLineText styleName="description">
            {transNode("description.download", {
              link: (parts) => <Link href="/document" variant="unstyledUnderline">{parts}</Link>
            })}
          </MultiLineText>
          <DownloadDictionaryButton dictionary={dictionary}/>
        </section>
      </div>
    );

  }
);