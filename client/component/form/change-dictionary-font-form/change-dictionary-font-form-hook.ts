//

import {BaseSyntheticEvent, useCallback, useMemo} from "react";
import {Asserts, array, mixed, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {uploadFileToAws} from "/client/util/aws";
import {forceArray} from "/client/util/misc";
import {determineAwsErrorToastType} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {testFileSize} from "/client/util/validation";
import {DICTIONARY_FONT_TARGET, Dictionary, DictionaryFont} from "/server/internal/skeleton";
import {RequestData} from "/server/internal/type/rest";


const SCHEMA = object({
  kind: string().oneOf(["none", "local", "custom"]).required(),
  name: string().when("kind", {
    is: "local",
    then: (schema) => schema.required("nameRequired")
  }),
  file: mixed<File>().test(testFileSize(1, "fileTooLarge")),
  targets: array(string().oneOf(DICTIONARY_FONT_TARGET).required()).required()
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
    const response = await request("changeDictionarySettings", getQuery(dictionary, value));
    return await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      return true;
    });
  }, [dictionary, request]);
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    if (value.kind === "custom" && value.file !== undefined) {
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
    kind: dictionary.settings.font?.kind ?? "none",
    name: (dictionary.settings.font?.kind === "local") ? dictionary.settings.font.name : undefined,
    file: undefined as any,
    targets: dictionary.settings.fontTargets
  } satisfies FormValue;
  return value;
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"changeDictionarySettings"> {
  const number = dictionary.number;
  const font = getQueryFont(dictionary, value);
  const fontTargets = forceArray(value.targets);
  return {number, settings: {font, fontTargets}};
}

function getQueryFont(dictionary: Dictionary, value: FormValue): DictionaryFont {
  if (value.kind === "none") {
    const font = {
      kind: "none" as const
    };
    return font;
  } else if (value.kind === "local") {
    const font = {
      kind: "local" as const,
      name: value.name ?? ""
    };
    return font;
  } else if (value.kind === "custom") {
    const currentFont = dictionary.settings.font;
    const currentName = (currentFont?.kind === "custom") ? currentFont.name : undefined;
    const currentFormat = (currentFont?.kind === "custom") ? currentFont.format : "";
    const font = {
      kind: "custom" as const,
      name: (value.file !== undefined) ? value.file.name : currentName,
      format: (value.file !== undefined) ? getFontFormat(value.file) : currentFormat
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