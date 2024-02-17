/* eslint-disable react/jsx-closing-bracket-location */

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
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormWordSection = create(
  require("./edit-example-form-word-section.scss"), "EditExampleFormWordSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditExampleSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {control} = form;
    const {fields: words, ...wordOperations} = useFieldArray({control, name: "words"});

    const addEquivalent = useCallback(function (): void {
      wordOperations.append(null);
    }, [wordOperations]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.words")}</h3>
        <div styleName="item-list">
          {(words.length > 0) ? (
            <div>TO BE IMPLEMENTED</div>
          ) : (
            <p styleName="absent">
              {trans("absent.word")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addEquivalent}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.word")}
            </Button>
          </div>
        </div>
      </section>
    );

  }
);