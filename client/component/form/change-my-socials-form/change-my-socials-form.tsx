/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
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

    const guessType = useCallback(function (index: number, url: string): void {
      const type = guessUserSocialType(url);
      if (type !== null) {
        setValue(`socials.${index}.type`, type);
      }
    }, [setValue]);

    return (
      <form styleName="root" {...rest}>
        <div styleName="table">
          {Array.from({length: SOCIAL_ROW_COUNT}, (dummy, index) => {
            const urlField = register(`socials.${index}.url`);
            return (
              <div styleName="row" key={index}>
                <Controller name={`socials.${index}.type`} control={control} render={({field}) => (
                  <UserSocialTypeSelect styleName="type" type={field.value} onSet={field.onChange}/>
                )}/>
                <Input styleName="url" placeholder={trans("placeholder.url")} {...urlField} onBlur={(event) => {
                  urlField.onBlur(event);
                  guessType(index, event.target.value);
                }}/>
              </div>
            );
          })}
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


/** リンクの URL からリンク種別を推測します。
 * 既知のサービスに合致した場合はその種別を返し、無効な URL や未知のサービスの場合は `null` を返します (この場合はユーザーの選択を上書きしません)。*/
function guessUserSocialType(url: string): UserSocialType | null {
  let type = null as UserSocialType | null;
  try {
    const normalizedUrl = (/^https?:\/\//.test(url)) ? url : `https://${url}`;
    const host = new URL(normalizedUrl).hostname.replace(/^www\./, "");
    if (host === "x.com" || host === "twitter.com") {
      type = "x";
    } else if (host === "bsky.app") {
      type = "bluesky";
    } else if (host.includes("misskey")) {
      type = "misskey";
    } else if (host === "note.com") {
      type = "note";
    } else if (host.includes("migdal")) {
      type = "migdal";
    } else if (host === "discord.gg" || host === "discord.com" || host === "discordapp.com") {
      type = "discord";
    } else {
      type = null;
    }
  } catch (error) {
    type = null;
  }
  return type;
}
