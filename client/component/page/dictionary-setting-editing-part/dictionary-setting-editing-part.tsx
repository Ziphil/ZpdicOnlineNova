//

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";
import {ChangeDictionaryMarkdownFeaturesForm} from "/client/component/form/change-dictionary-markdown-features-form";
import {ChangeDictionarySettingsForm} from "/client/component/form/change-dictionary-settings-form";
import {ChangeDictionarySourceForm} from "/client/component/form/change-dictionary-source-form";
import {DictionaryWithExecutors} from "/server/internal/skeleton";


export const DictionarySettingEditingPart = create(
  require("./dictionary-setting-editing-part.scss"), "DictionarySettingEditingPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("dictionarySettingEditingPart");

    const {dictionary} = useOutletContext<{dictionary: DictionaryWithExecutors}>();

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
          <h3 styleName="heading">{trans("heading.enableAdvancedWord")}</h3>
          <MultiLineText styleName="description">
            {trans("description.enableAdvancedWord")}
          </MultiLineText>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="enableAdvancedWord"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.markdownFeatures")}</h3>
          <MultiLineText styleName="description">
            {trans("description.markdownFeatures")}
          </MultiLineText>
          <ChangeDictionaryMarkdownFeaturesForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.enableDuplicateName")}</h3>
          <MultiLineText styleName="description">
            {trans("description.enableDuplicateName")}
          </MultiLineText>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="enableDuplicateName"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.punctuations")}</h3>
          <MultiLineText styleName="description">
            {trans("description.punctuations")}
          </MultiLineText>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="punctuations"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.ignoredEquivalentPattern")}</h3>
          <MultiLineText styleName="description">
            {trans("description.ignoredEquivalentPattern")}
          </MultiLineText>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="ignoredEquivalentPattern"/>
        </section>
      </div>
    );

  }
);