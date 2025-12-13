//

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {create} from "/client/component/create";
import {ChangeDictionaryFontForm} from "/client/component/form/change-dictionary-font-form";
import {ChangeDictionaryMarkdownFeaturesForm} from "/client/component/form/change-dictionary-markdown-features-form";
import {ChangeDictionarySettingsForm} from "/client/component/form/change-dictionary-settings-form";
import {ChangeDictionaryShowNumbersForm} from "/client/component/form/change-dictionary-show-numbers-form";
import {ChangeDictionarySlimeTitlesForm} from "/client/component/form/change-dictionary-slime-titles-form";
import {ChangeDictionaryWordCardTitlesForm} from "/client/component/form/change-dictionary-word-card-titles-form";
import {DictionaryWithExecutors} from "/server/internal/skeleton";


export const DictionarySettingDisplayPart = create(
  require("./dictionary-setting-display-part.scss"), "DictionarySettingDisplayPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("dictionarySettingDisplayPart");

    const {dictionary} = useOutletContext<{dictionary: DictionaryWithExecutors}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.font")}</h3>
          <ChangeDictionaryFontForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.markdownFeatures")}</h3>
          <ChangeDictionaryMarkdownFeaturesForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.showNumbers")}</h3>
          <ChangeDictionaryShowNumbersForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.showVariationPronunciation")}</h3>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="showVariationPronunciation"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.wordCardTitles")}</h3>
          <MultiLineText styleName="description">
            {trans("description.wordCardTitles")}
          </MultiLineText>
          <ChangeDictionaryWordCardTitlesForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.slimeTitles")}</h3>
          <MultiLineText styleName="description">
            {trans("description.slimeTitles")}
          </MultiLineText>
          <ChangeDictionarySlimeTitlesForm dictionary={dictionary}/>
        </section>
      </div>
    );

  }
);