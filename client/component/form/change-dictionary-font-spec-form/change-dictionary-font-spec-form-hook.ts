//

import {BaseSyntheticEvent, useCallback, useMemo} from "react";
import {Asserts, mixed, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary, DictionaryFontSpec} from "/client/skeleton";
import {uploadFileToAws} from "/client/util/aws";
import {switchResponse} from "/client/util/response";
import {validateFileSize} from "/client/util/validation";


const SCHEMA = object({
  type: string().oneOf(["none", "local", "custom"]).required(),
  name: string().when("type", {
    is: "local",
    then: (schema) => schema.required()
  }),
  file: mixed<File>().test("fileSize", "tooLarge", validateFileSize(1))
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionaryFontSpecSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionaryFontSpec(dictionary: Dictionary): ChangeDictionaryFontSpecSpec {
  const form = useForm<FormValue>(SCHEMA, getFormValue(dictionary), {});
  const request = useRequest();
  const {dispatchSuccessToast, dispatchErrorToast} = useToast();
  const uploadFont = useCallback(async function (value: FormValue): Promise<boolean | void> {
    const extension = value.file!.name.split(".").pop() ?? "";
    const response = await request("fetchUploadFontPost", {number: dictionary.number, extension}, {useRecaptcha: true});
    return await switchResponse(response, async (post) => {
      try {
        await uploadFileToAws(post, value.file!);
        return true;
      } catch (error) {
        const type = deternimeErrorToastType(error);
        dispatchErrorToast(type);
        return undefined;
      }
    });
  }, [dictionary.number, request, dispatchErrorToast]);
  const changeSettings = useCallback(async function (value: FormValue): Promise<boolean | void> {
    const response = await request("changeDictionarySettings", {number: dictionary.number, settings: {fontSpec: getQueryFontSpec(dictionary, value)}});
    return await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (data) => data.number === dictionary.number);
      return true;
    });
  }, [dictionary, request]);
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    if (value.type === "custom" && value.file !== null) {
      const results = await Promise.all([changeSettings(value), uploadFont(value)]);
      if (results.every((result) => result)) {
        dispatchSuccessToast("changeDictionaryFontSpec");
      }
    } else {
      const result = await changeSettings(value);
      if (result) {
        dispatchSuccessToast("changeDictionaryFontSpec");
      }
    }
  }), [form, changeSettings, uploadFont, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue(dictionary: Dictionary): FormValue {
  const value = {
    type: dictionary.settings.fontSpec?.type ?? "none",
    name: (dictionary.settings.fontSpec?.type === "local") ? dictionary.settings.fontSpec.name : undefined,
    file: null as any
  } satisfies FormValue;
  return value;
}

function getQueryFontSpec(dictionary: Dictionary, formValue: FormValue): DictionaryFontSpec {
  if (formValue.type === "local") {
    const fontSpec = {
      type: "local" as const,
      name: formValue.name ?? ""
    };
    return fontSpec;
  } else {
    const fontSpec = {
      type: "custom" as const
    };
    return fontSpec;
  }
}

function deternimeErrorToastType(error: any): string {
  if (error.name === "AwsError") {
    const code = error.data["Code"]["_text"];
    const message = error.data["Message"]["_text"];
    if (code === "EntityTooLarge") {
      return "resourceSizeTooLarge";
    } else if (code === "AccessDenied" && message.includes("Policy Condition failed") && message.includes("$Content-Type")) {
      return "unsupportedResourceType";
    } else {
      return "awsError";
    }
  } else {
    return "unexpected";
  }
}