//

import {toNestErrors, validateFieldsNatively} from "@hookform/resolvers";
import {FieldError, FieldErrors, FieldValues, Resolver, ResolverOptions, ResolverResult, appendErrors} from "react-hook-form";
import {Primitive} from "ts-essentials";
import {ObjectSchema, ValidationError} from "yup";


const IGNORED_ERROR_PARAM_KEYS = ["value", "originalValue", "spec"];

export type FormErrorParams = Record<string, Primitive>;
export type FormFieldError = FieldError & {params?: FormErrorParams};

/** yup のスキーマから react-hook-form のリゾルバを作成します。
 * `@hookform/resolvers` の `yupResolver` は yup が返す検証パラメータを捨ててしまいますが、
 * このリゾルバはそれをエラーオブジェクトの `params` に残すので、実際に検証に使われた上限値などをエラーメッセージ内に埋め込むことができます。*/
export function createFormResolver<V extends FieldValues>(schema: ObjectSchema<V>): Resolver<V> {
  const resolver = async function (values: V, context: any, options: ResolverOptions<V>): Promise<ResolverResult<V>> {
    try {
      const validatedValues = await schema.validate(values, {abortEarly: false, context});
      if (options.shouldUseNativeValidation) {
        validateFieldsNatively({}, options);
      }
      return {values: validatedValues as V, errors: {}};
    } catch (error) {
      if (error instanceof ValidationError) {
        return {values: {}, errors: toNestErrors(createFieldErrors(error, options), options)};
      } else {
        throw error;
      }
    }
  };
  return resolver;
}

/** エラーオブジェクトから検証パラメータを取り出します。*/
export function getFormErrorParams(error: FieldError | undefined): FormErrorParams | undefined {
  const params = (error as FormFieldError | undefined)?.params;
  return params;
}

function createFieldErrors<V extends FieldValues>(error: ValidationError, options: ResolverOptions<V>): FieldErrors {
  const validatesAllCriteria = !options.shouldUseNativeValidation && options.criteriaMode === "all";
  const errors = {} as Record<string, FormFieldError>;
  for (const innerError of error.inner) {
    const path = innerError.path ?? "";
    const type = innerError.type ?? "";
    if (errors[path] === undefined) {
      errors[path] = {message: innerError.message, type, params: createFormErrorParams(innerError)};
    }
    if (validatesAllCriteria) {
      const previousMessages = errors[path].types?.[type];
      const messages = (previousMessages !== undefined) ? ([] as Array<string>).concat(previousMessages as Array<string>, innerError.message) : innerError.message;
      errors[path] = appendErrors(path, validatesAllCriteria, errors, type, messages) as FormFieldError;
    }
  }
  return errors as FieldErrors;
}

function createFormErrorParams(error: ValidationError): FormErrorParams | undefined {
  if (error.params !== undefined) {
    const params = Object.fromEntries(Object.entries(error.params).filter(([key]) => !IGNORED_ERROR_PARAM_KEYS.includes(key))) as FormErrorParams;
    return params;
  } else {
    return undefined;
  }
}
