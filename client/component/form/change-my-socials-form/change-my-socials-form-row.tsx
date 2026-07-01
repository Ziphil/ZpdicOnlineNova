/* eslint-disable react/jsx-closing-bracket-location */

import {FocusEvent, ReactElement, useCallback} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, Input, useTrans} from "zographia";
import {UserSocialTypeSelect} from "/client/component/atom/user-social-type-select";
import {create} from "/client/component/create";
import {UseFormReturn} from "/client/hook/form";
import {UserSocialType} from "/server/internal/skeleton";
import {ChangeMySocialsFormValue} from "./change-my-socials-form-hook";


export const ChangeMySocialsFormRow = create(
  require("./change-my-socials-form-row.scss"), "ChangeMySocialsFormRow",
  function ({
    form,
    index,
    ...rest
  }: {
    form: UseFormReturn<ChangeMySocialsFormValue>,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeMySocialsForm");

    const {control, register, setValue} = form;

    const handleBlur = useCallback(function (event: FocusEvent<HTMLInputElement>): void {
      const type = guessUserSocialType(event.target.value);
      if (type !== null) {
        setValue(`socials.${index}.type`, type);
      }
    }, [setValue, index]);

    return (
      <div styleName="root" {...rest}>
        <Controller name={`socials.${index}.type`} control={control} render={({field}) => (
          <UserSocialTypeSelect styleName="type" type={field.value} onSet={field.onChange}/>
        )}/>
        <Input styleName="url" placeholder={trans("placeholder.url")} {...register(`socials.${index}.url`, {onBlur: handleBlur})}/>
      </div>
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
