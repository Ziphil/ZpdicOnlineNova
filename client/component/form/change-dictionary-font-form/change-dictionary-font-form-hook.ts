//

import {BaseSyntheticEvent, useCallback, useMemo} from "react";
import {Asserts, mixed, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {uploadFileToAws} from "/client/util/aws";
import {determineAwsErrorToastType} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {testFileSize} from "/client/util/validation";
import {Dictionary, DictionaryFont} from "/server/internal/skeleton";


const SCHEMA = object({
  type: string().oneOf(["none", "local", "custom"]).required(),
  name: string().when("type", {
    is: "local",
    then: (schema) => schema.required("nameRequired")
  }),
  file: mixed<File>().test(testFileSize(1, "fileTooLarge"))
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionaryFontSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionaryFont(dictionary: Dictionary): ChangeDictionaryFontSpec {
  const form = useForm<FormValue>(SCHEMA, getFormValue(dictionary), {});
  const request = useRequest();
  const {dispatchSuccessToast, dispatchErrorToast} = useToast();
  const uploadFont = useCallback(async function (value: FormValue): Promise<boolean | void> {
    const response = await request("fetchUploadDictionaryFontPost", {number: dictionary.number}, {useRecaptcha: true});
    return await switchResponse(response, async (post) => {
      try {
        await uploadFileToAws(post, value.file!);
        return true;
      } catch (error) {
        dispatchErrorToast(determineAwsErrorToastType(error));
        return undefined;
      }
    });
  }, [dictionary.number, request, dispatchErrorToast]);
  const changeSettings = useCallback(async function (value: FormValue): Promise<boolean | void> {
    const response = await request("changeDictionarySettings", {number: dictionary.number, settings: {font: getQueryFont(dictionary, value)}});
    return await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      return true;
    });
  }, [dictionary, request]);
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    if (value.type === "custom" && value.file !== undefined) {
      const results = await Promise.all([changeSettings(value), uploadFont(value)]);
      if (results.every((result) => result)) {
        dispatchSuccessToast("changeDictionarySettings.font");
      }
    } else {
      const result = await changeSettings(value);
      if (result) {
        dispatchSuccessToast("changeDictionarySettings.font");
      }
    }
  }), [form, changeSettings, uploadFont, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue(dictionary: Dictionary): FormValue {
  const value = {
    type: dictionary.settings.font?.type ?? "none",
    name: (dictionary.settings.font?.type === "local") ? dictionary.settings.font.name : undefined,
    file: undefined as any
  } satisfies FormValue;
  return value;
}

function getQueryFont(dictionary: Dictionary, formValue: FormValue): DictionaryFont {
  if (formValue.type === "none") {
    const font = {
      type: "none" as const
    };
    return font;
  } else if (formValue.type === "local") {
    const font = {
      type: "local" as const,
      name: formValue.name ?? ""
    };
    return font;
  } else if (formValue.type === "custom") {
    const currentFont = dictionary.settings.font;
    const currentName = (currentFont?.type === "custom") ? currentFont.name : undefined;
    const currentFormat = (currentFont?.type === "custom") ? currentFont.format : "";
    const font = {
      type: "custom" as const,
      name: (formValue.file !== undefined) ? formValue.file.name : currentName,
      format: (formValue.file !== undefined) ? getFontFormat(formValue.file) : currentFormat
    };
    return font;
  } else {
    throw new Error("cannot happen");
  }
}

function getFontFormat(file: File): string {
  const extension = file.name.split(".").pop();
  if (extension === "ttf") {
    return "truetype";
  } else if (extension === "otf") {
    return "opentype";
  } else if (extension === "woff") {
    return "woff";
  } else if (extension === "woff2") {
    return "woff2";
  } else {
    return "";
  }
}