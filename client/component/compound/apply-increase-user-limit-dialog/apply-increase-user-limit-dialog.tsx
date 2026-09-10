//

import {faCheck, faGift} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, cloneElement} from "react";
import {
  Button,
  ButtonIconbag,
  CheckableCard,
  CheckableCardBody,
  ControlContainer,
  ControlLabel,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogPane,
  GeneralIcon,
  Link,
  LinkIconbag,
  MultiLineText,
  Radio,
  Textarea,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {useDialogOpen} from "/client/hook/dialog";
import {UserWithDetail} from "/server/internal/skeleton";
import {GIFT_URL} from "/server/model/constant";
import {useApplyIncreaseUserLimit} from "./apply-increase-user-limit-dialog-hook";


const AFTER_LIMITS = {
  dictionaryCount: 200
};

export const ApplyIncreaseUserLimitDialog = create(
  require("./apply-increase-user-limit-dialog.scss"), "ApplyIncreaseUserLimitDialog",
  function ({
    me,
    trigger,
    ...rest
  }: {
    me: UserWithDetail,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans, transNode} = useTrans("applyIncreaseUserLimitDialog");

    const {form, handleSubmit} = useApplyIncreaseUserLimit();
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen({handleSubmit, onOpen: form.resetAll});
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} {...rest}>
          <DialogPane>
            <DialogCloseButton/>
            <DialogBody is="form">
              <h2 styleName="heading">{trans("heading")}</h2>
              <div styleName="message-group">
                <MultiLineText styleName="message" is="p">
                  {trans("message.0")}
                </MultiLineText>
                <MultiLineText styleName="message" is="p">
                  {trans("message.1")}
                </MultiLineText>
              </div>
              <div styleName="control">
                <ControlContainer label={false}>
                  <ControlLabel>{trans("label.kind.label")}</ControlLabel>
                  <div styleName="card-group">
                    {(["dictionaryCount"] as const).map((kind) => (
                      <CheckableCard styleName="card" key={kind}>
                        <Radio value={kind} {...register("kind")}/>
                        <CheckableCardBody styleName="card-body">
                          <div styleName="label">
                            <div>{trans(`label.kind.${kind}`)}</div>
                            <div styleName="label-change">
                              {transNode("label.kind.change", {
                                current: me.limits[kind],
                                after: AFTER_LIMITS[kind],
                                arrow: (parts) => <span styleName="arrow">{parts}</span>
                              })}
                            </div>
                          </div>
                        </CheckableCardBody>
                      </CheckableCard>
                    ))}
                  </div>
                  <ControlErrorMessage name="kind" form={form} trans={trans}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.message")}
                  </ControlLabel>
                  <Textarea
                    styleName="textarea"
                    error={getFieldState("message").error !== undefined}
                    required={true}
                    {...register("message")}
                  />
                  <ControlErrorMessage name="message" form={form} trans={trans}/>
                </ControlContainer>
              </div>
              <div styleName="button">
                <Link href={GIFT_URL} target="_blank" variant="light">
                  <LinkIconbag><GeneralIcon icon={faGift}/></LinkIconbag>
                  {trans("button.gift")}
                </Link>
                <Button type="submit" onClick={handleSubmitAndClose}>
                  <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
                  {trans("button.confirm")}
                </Button>
              </div>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);
