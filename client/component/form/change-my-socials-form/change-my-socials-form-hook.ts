//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, array, object, string} from "yup";
import {useRefetchMe} from "/client/hook/auth";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {USER_SOCIAL_TYPES, UserSocialTypeUtil, UserWithDetail} from "/server/internal/skeleton";


export const SOCIAL_ROW_COUNT = 5;

const SCHEMA = object({
  socials: array(object({
    type: string().oneOf(USER_SOCIAL_TYPES).required(),
    url: string().defined()
  })).required()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeMySocialsSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeMySocials(me: UserWithDetail): ChangeMySocialsSpec {
  const form = useForm<FormValue>(SCHEMA, getDefaultValue(me), {});
  const request = useRequest();
  const refetchMe = useRefetchMe();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const socials = value.socials.filter((social) => social.url.trim() !== "").map((social) => ({type: social.type, url: social.url.trim()}));
    const response = await request("changeMySocials", {socials});
    await switchResponse(response, async () => {
      await Promise.all([
        refetchMe(),
        invalidateResponses("fetchUser", (query) => query.name === me.name)
      ]);
      dispatchSuccessToast("changeMySocials");
    });
  }), [me.name, request, refetchMe, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getDefaultValue(me: UserWithDetail): FormValue {
  const socials = Array.from({length: SOCIAL_ROW_COUNT}, (dummy, index) => {
    const social = me.socials[index];
    return (social !== undefined) ? {type: UserSocialTypeUtil.cast(social.type), url: social.url} : {type: "website" as const, url: ""};
  });
  return {socials};
}
