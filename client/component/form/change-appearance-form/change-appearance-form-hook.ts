//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {APPEARANCE_FONTS, APPEARANCE_SCHEMES, AppearanceFont, AppearanceScheme, THEMES, Theme} from "/client/constant/appearance";
import {useAppearance, useChangeAppearance as useRawChangeAppearance} from "/client/hook/appearance";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useToast} from "/client/hook/toast";


const SCHEMA = object({
  theme: string().oneOf(APPEARANCE_SCHEMES.map((scheme) => THEMES.map((theme) => `${scheme}-${theme}` as const)).flat()).required(),
  font: string().oneOf(APPEARANCE_FONTS).required()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeAppearanceSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeAppearance(): ChangeAppearanceSpec {
  const appearance = useAppearance();
  const changeAppearance = useRawChangeAppearance();
  const form = useForm<FormValue>(SCHEMA, {theme: `${appearance.scheme}-${appearance.theme}` as const, font: appearance.font}, {});
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit((value) => {
    changeAppearance({
      scheme: value.theme.split("-")[0] as AppearanceScheme,
      theme: value.theme.split("-")[1] as Theme,
      font: value.font as AppearanceFont
    });
    dispatchSuccessToast("changeAppearance");
  }), [form, changeAppearance, dispatchSuccessToast]);
  return {form, handleSubmit};
}