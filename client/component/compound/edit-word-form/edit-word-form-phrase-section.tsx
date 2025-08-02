/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFormReturn, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordFormValue} from "./edit-word-form-hook";
import {EditWordFormPhraseItem} from "./edit-word-form-phrase-item";


export const EditWordFormPhraseSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormPhraseSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editWordForm");

    const {control, getValues, setValue} = form;
    const {fields: phrases, ...phraseOperations} = useFieldArray({control, name: "sections.0.phrases"});

    const addPhrase = useCallback(function (): void {
      phraseOperations.append({
        titles: [],
        form: "",
        termString: ""
      });
    }, [phraseOperations]);

    const setPhrases = useCallback(function (update: (phrases: Array<any>) => Array<any>): void {
      setValue("sections.0.phrases", update(getValues("sections.0.phrases")));
    }, [getValues, setValue]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.phrases")}</h3>
        <div styleName="list">
          {(phrases.length > 0) ? (
            <EditWordFormDndContext values={phrases} setValues={setPhrases}>
              {phrases.map((phrase, index) => (
                <EditWordFormPhraseItem
                  styleName="item"
                  key={phrase.id}
                  dictionary={dictionary}
                  form={form}
                  phraseOperations={phraseOperations as any}
                  dndId={phrase.id}
                  index={index}
                />
              ))}
            </EditWordFormDndContext>
          ) : (
            <p styleName="absent">
              {trans("absent.phrase")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addPhrase}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.phrase")}
            </Button>
          </div>
        </div>
      </section>
    );

  }
);