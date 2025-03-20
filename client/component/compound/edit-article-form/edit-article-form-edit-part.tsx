/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, ControlLabel, GeneralIcon, Input, TagInput, Textarea, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {preventDefault} from "/client/util/form";
import {EditArticleSpec} from "./edit-article-form-hook";


export const EditArticleFormEditPart = create(
  require("./edit-article-form-edit-part.scss"), "EditArticleFormEditPart",
  function ({
    dictionary,
    formSpec,
    ...rest
  }: {
    dictionary: Dictionary,
    formSpec: EditArticleSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editArticleForm");

    const {form, handleSubmit} = formSpec;
    const {register, control} = form;

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <div styleName="main">
          <div styleName="control">
            <ControlContainer>
              <ControlLabel>{trans("label.tags")}</ControlLabel>
              <Controller name="tags" control={control} render={({field}) => (
                <TagInput tagVariant="solid" values={field.value} onSet={field.onChange}/>
              )}/>
            </ControlContainer>
            <ControlContainer>
              <ControlLabel>{trans("label.title")}</ControlLabel>
              <Input {...register("title")}/>
            </ControlContainer>
            <ControlContainer>
              <ControlLabel>{trans("label.content")}</ControlLabel>
              <Textarea styleName="textarea" {...register("content")}/>
            </ControlContainer>
          </div>
        </div>
        <div styleName="button">
          <Button onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans("button.confirm")}
          </Button>
        </div>
      </form>
    );

  }
);