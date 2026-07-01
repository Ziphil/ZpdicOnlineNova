/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {FocusEvent, ReactElement, useCallback} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, Input, useTrans} from "zographia";
import {UserSocialTypeSelect} from "/client/component/atom/user-social-type-select";
import {create} from "/client/component/create";
import {UserSocialType, UserWithDetail} from "/server/internal/skeleton";
import {SOCIAL_ROW_COUNT, useChangeMySocials} from "./change-my-socials-form-hook";


export const ChangeMySocialsForm = create(
  require("./change-my-socials-form.scss"), "ChangeMySocialsForm",
  function ({
    me,
    ...rest
  }: {
    me: UserWithDetail,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeMySocialsForm");

    const {form, handleSubmit} = useChangeMySocials(me);
    const {control, register, setValue} = form;

    const handleBlur = useCallback(function (event: FocusEvent<HTMLInputElement>): void {
      const type = guessUserSocialType(event.target.value);
      if (type !== null) {
        setValue(event.target.name.replace(/\.url$/, ".type") as `socials.${number}.type`, type);
      }
    }, [setValue]);

    return (
      <form styleName="root" {...rest}>
        <div styleName="table">
          {Array.from({length: SOCIAL_ROW_COUNT}, (dummy, index) => (
            <div styleName="row" key={index}>
              <Controller name={`socials.${index}.type`} control={control} render={({field}) => (
                <UserSocialTypeSelect styleName="type" type={field.value} onSet={field.onChange}/>
              )}/>
              <Input styleName="url" placeholder={trans("placeholder.url")} {...register(`socials.${index}.url`, {onBlur: handleBlur})}/>
            </div>
          ))}
        </div>
        <div>
          <Button variant="light" type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);


function guessUserSocialType(url: string): UserSocialType | null {
  try {
    const normalizedUrl = (/^https?:\/\//.test(url)) ? url : `https://${url}`;
    const host = new URL(normalizedUrl).hostname.replace(/^www\./, "");
    if (host === "x.com" || host === "twitter.com") {
      return "x";
    } else if (host === "bsky.app") {
      return "bluesky";
    } else if (host.includes("misskey")) {
      return "misskey";
    } else if (host === "note.com") {
      return "note";
    } else if (host === "migdal.jp") {
      return "migdal";
    } else if (host === "discord.gg" || host === "discord.com" || host === "discordapp.com") {
      return "discord";
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
