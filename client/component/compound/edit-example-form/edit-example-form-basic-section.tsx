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

    const offerId = form.watch("offer");
    const [offer] = useResponse("fetchExampleOffer", (offerId !== undefined) && {id: offerId});

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
            <Textarea styleName="textarea" disabled={!!offerId} {...register("translation")}>
              {(offer !== undefined) && (
                <TextareaAddon position="top">
                  <Tag variant="solid">
                    {trans(`tag.${offer.position.name}`, {
                      number: offer.position.index + 1,
                      dateString: transDate(dayjs(offer.createdDate).tz("Asia/Tokyo"), "date")
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