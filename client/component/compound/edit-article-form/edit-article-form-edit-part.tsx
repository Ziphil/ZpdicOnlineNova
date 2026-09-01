/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, ControlContainer, ControlLabel, Input, TagInput, Textarea, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {Dictionary} from "/server/internal/skeleton";
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

    const {form} = formSpec;
    const {register, control, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <div styleName="main">
          <div styleName="control">
            <ControlContainer>
              <ControlLabel>{trans("label.tags")}</ControlLabel>
              <Controller name="tags" control={control} render={({field}) => (
                <TagInput tagVariant="solid" error={!!getFieldState("tags").error} values={field.value} onSet={field.onChange}/>
              )}/>
              <ControlErrorMessage name="tags" form={form} trans={trans}/>
            </ControlContainer>
            <ControlContainer>
              <ControlLabel>{trans("label.title")}</ControlLabel>
              <Input error={!!getFieldState("title").error} {...register("title")}/>
              <ControlErrorMessage name="title" form={form} trans={trans}/>
            </ControlContainer>
            <ControlContainer>
              <ControlLabel>{trans("label.content")}</ControlLabel>
              <Textarea styleName="textarea" error={!!getFieldState("content").error} {...register("content")}/>
              <ControlErrorMessage name="content" form={form} trans={trans}/>
            </ControlContainer>
          </div>
        </div>
      </form>
    );

  }
);