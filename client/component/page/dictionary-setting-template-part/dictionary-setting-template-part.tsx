/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {EditTemplateWordDialog} from "/client/component/compound/edit-word-dialog";
import {TemplateWordList} from "/client/component/compound/template-word-list";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";


export const DictionarySettingTemplatePart = create(
  require("./dictionary-setting-template-part.scss"), "DictionarySettingTemplatePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingTemplatePart");

    const {dictionary} = useOutletContext<{dictionary: DictionaryWithExecutors}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.templateWords")}</h3>
          <div styleName="list-container">
            <div>
              <EditTemplateWordDialog dictionary={dictionary} initialData={null} trigger={(
                <Button variant="light">
                  <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                  {trans("button.addTemplateWord")}
                </Button>
              )}/>
            </div>
            <TemplateWordList dictionary={dictionary} words={dictionary.settings.templateWords} pageSpec={{size: 20}}/>
          </div>
        </section>
      </div>
    );

  }
);