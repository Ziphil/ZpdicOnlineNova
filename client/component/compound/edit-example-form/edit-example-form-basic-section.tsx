/* eslint-disable react/jsx-closing-bracket-location */
//

import dayjs from "dayjs";
import {ReactElement} from "react";
import {
  AdditionalProps,
  ControlContainer,
  ControlLabel,
  Tag,
  Textarea,
  TextareaAddon,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormBasicSection = create(
  require("./edit-example-form-basic-section.scss"), "EditExampleFormBasicSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditExampleSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("editExampleForm");

    const {register} = form;

    const offer = form.watch("offer");
    const [innerOffer] = useResponse("fetchExampleOffer", (typeof offer === "string") && {id: offer});
    const actualOffer = (typeof offer === "string") ? innerOffer : offer;

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.basic")}</h3>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.sentence")}</ControlLabel>
            <Textarea styleName="textarea" {...register("sentence")}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.translation")}</ControlLabel>
            <Textarea styleName="textarea" disabled={!!offer} {...register("translation")}>
              {(actualOffer) && (
                <TextareaAddon position="top">
                  <Tag variant="solid">
                    {trans(`tag.${actualOffer.position.name}`, {
                      number: actualOffer.position.index + 1,
                      dateString: transDate(dayjs(actualOffer.createdDate).tz("Asia/Tokyo"), "date")
                    })}
                  </Tag>
                </TextareaAddon>
              )}
            </Textarea>
          </ControlContainer>
        </div>
      </section>
    );

  }
);