/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn, UseFormReturn, useFieldArray} from "react-hook-form";
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
    sectionOperations,
    sectionIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    sectionOperations: Omit<UseFieldArrayReturn<any, "sections">, "fields">,
    sectionIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {control, getValues} = form;
    const {fields: phrases, ...phraseOperations} = useFieldArray({control, name: `sections.${sectionIndex}.phrases`});

    const addPhrase = useCallback(function (): void {
      phraseOperations.append({titles: [], expression: "", termString: ""});
    }, [phraseOperations]);

    const setPhrases = useCallback(function (update: (phrases: Array<any>) => Array<any>): void {
      sectionOperations.update(sectionIndex, {...getValues(`sections.${sectionIndex}`), phrases: update(getValues(`sections.${sectionIndex}.phrases`))});
    }, [sectionIndex, getValues, sectionOperations]);

    return (
      <section styleName="root" {...rest}>
        <h4 styleName="heading">{trans("heading.phrases")}</h4>
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
                  sectionIndex={sectionIndex}
                  phraseIndex={index}
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