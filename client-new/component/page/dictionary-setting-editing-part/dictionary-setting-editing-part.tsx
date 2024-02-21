//

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {create} from "/client-new/component/create";
import {ChangeDictionarySettingsForm} from "/client-new/component/form/change-dictionary-settings-form";
import {ChangeDictionarySourceForm} from "/client-new/component/form/change-dictionary-source-form";
import {EnhancedDictionary} from "/client-new/skeleton";


export const DictionarySettingEditingPart = create(
  require("./dictionary-setting-editing-part.scss"), "DictionarySettingEditingPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("dictionarySettingEditingPart");

    const {dictionary} = useOutletContext<{dictionary: EnhancedDictionary}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.akrantiainSource")}</h3>
          <MultiLineText styleName="description">
            {transNode("description.akrantiainSource", {
              link: (parts) => <Link href="/document" variant="unstyledUnderline">{parts}</Link>
            })}
          </MultiLineText>
          <ChangeDictionarySourceForm dictionary={dictionary} language="akrantiain"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.zatlinSource")}</h3>
          <MultiLineText styleName="description">
            {transNode("description.zatlinSource", {
              link: (parts) => <Link href="/document" variant="unstyledUnderline">{parts}</Link>
            })}
          </MultiLineText>
          <ChangeDictionarySourceForm dictionary={dictionary} language="zatlin"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.enableMarkdown")}</h3>
          <MultiLineText styleName="description">
            {trans("description.enableMarkdown")}
          </MultiLineText>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="enableMarkdown"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.enableDuplicateName")}</h3>
          <MultiLineText styleName="description">
            {trans("description.enableDuplicateName")}
          </MultiLineText>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="enableDuplicateName"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.exampleTitle")}</h3>
          <MultiLineText styleName="description">
            {trans("description.exampleTitle")}
          </MultiLineText>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="exampleTitle"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.pronunciationTitle")}</h3>
          <MultiLineText styleName="description">
            {trans("description.pronunciationTitle")}
          </MultiLineText>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="pronunciationTitle"/>
        </section>
      </div>
    );

  }
);