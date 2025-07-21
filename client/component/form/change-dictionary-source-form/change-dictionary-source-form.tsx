/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faPlay} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Textarea, useTrans} from "zographia";
import {ExecuteAkrantiainDialog} from "/client/component/compound/execute-akrantiain-dialog";
import {ExecuteZatlinDialog} from "/client/component/compound/execute-zatlin-dialog";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
import {useChangeDictionarySource} from "./change-dictionary-source-form-hook";


export const ChangeDictionarySourceForm = create(
  require("../common.scss"), "ChangeDictionarySourceForm",
  function ({
    dictionary,
    language,
    ...rest
  }: {
    dictionary: Dictionary,
    language: "akrantiain" | "zatlin",
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionarySourceForm");

    const {form, handleSubmit} = useChangeDictionarySource(dictionary, language);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Textarea styleName="textarea" fontFamily="monospace" {...register("source")}/>
        </ControlContainer>
        <div styleName="button">
          <Button variant="light" type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
          {(language === "akrantiain") && (
            <ExecuteAkrantiainDialog sourceForm={form} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faPlay}/></ButtonIconbag>
                {trans("button.try")}
              </Button>
            )}/>
          )}
          {(language === "zatlin") && (
            <ExecuteZatlinDialog sourceForm={form} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faPlay}/></ButtonIconbag>
                {trans("button.try")}
              </Button>
            )}/>
          )}
        </div>
      </form>
    );

  }
);