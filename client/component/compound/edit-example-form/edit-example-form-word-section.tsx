//

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {EditExampleFormDndContext} from "./edit-example-form-dnd";
import {EditExampleSpec} from "./edit-example-form-hook";
import {EditExampleFormWordItem} from "./edit-example-form-word-item";


export const EditExampleFormWordSection = create(
  require("./edit-example-form-word-section.scss"), "EditExampleFormWordSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditExampleSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {control, getValues, setValue} = form;
    const {fields: words, ...wordOperations} = useFieldArray({control, name: "words"});

    const addWord = useCallback(function (): void {
      wordOperations.append(null);
    }, [wordOperations]);

    const setWords = useCallback(function (update: (words: Array<any>) => Array<any>): void {
      setValue("words", update(getValues("words")));
    }, [getValues, setValue]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.words")}</h3>
        <div styleName="list">
          {(words.length > 0) ? (
            <EditExampleFormDndContext values={words} setValues={setWords}>
              {words.map((word, index) => (
                <EditExampleFormWordItem
                  styleName="item"
                  key={word.id}
                  dictionary={dictionary}
                  form={form}
                  wordOperations={wordOperations}
                  dndId={word.id}
                  index={index}
                />
              ))}
            </EditExampleFormDndContext>
          ) : (
            <p styleName="absent">
              {trans("absent.word")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addWord}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.word")}
            </Button>
          </div>
        </div>
      </section>
    );

  }
);