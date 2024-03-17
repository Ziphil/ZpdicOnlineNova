//

import {faUser} from "@fortawesome/sharp-regular-svg-icons";
import axios from "axios";
import {ReactElement} from "react";
import {useQuery} from "react-query";
import {AdditionalProps, Avatar, AvatarFallbackIconContainer, GeneralIcon} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";


export const SupporterList = create(
  require("./supporter-list.scss"), "SupporterList",
  function ({
    supporters,
    ...rest
  }: {
    supporters: Array<Supporter>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {data: resolvedSupporters} = useQuery(["supporters", supporters], async () => {
      const resolvedSupporters = await Promise.all(supporters.map(async (supporter) => {
        const name = supporter.name;
        const linkUrl = await resolveLinkUrl(supporter.linkUrl);
        const avatarUrl = await resolveAvatarUrl(supporter.avatarUrl);
        return {name, linkUrl, avatarUrl};
      }));
      return resolvedSupporters;
    }, RESPONSE_CONFIG);

    return (
      <ul styleName="root" {...rest}>
        {resolvedSupporters?.map((resolvedSupporter) => (
          <li styleName="item" key={resolvedSupporter.name}>
            <Avatar styleName="avatar" url={resolvedSupporter.avatarUrl} inline={true}>
              <AvatarFallbackIconContainer hue={30}><GeneralIcon icon={faUser}/></AvatarFallbackIconContainer>
            </Avatar>
            {(resolvedSupporter.linkUrl !== undefined) ? (
              <Link href={resolvedSupporter.linkUrl} scheme="secondary" target="_blank">{resolvedSupporter.name}</Link>
            ) : (
              <span>{resolvedSupporter.name}</span>
            )}
          </li>
        ))}
      </ul>
    );

  }
);


async function resolveAvatarUrl(rawAvatarUrl?: SupporterAvatarUrl): Promise<string | undefined> {
  if (rawAvatarUrl !== undefined) {
    if (typeof rawAvatarUrl === "string") {
      return rawAvatarUrl;
    } else if (rawAvatarUrl.type === "github") {
      const response = await axios.get(`https://api.github.com/users/${rawAvatarUrl.name}`, {validateStatus: () => true});
      if (response.status === 200) {
        const avatarUrl = response.data["avatar_url"];
        return avatarUrl;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

async function resolveLinkUrl(rawUrl?: SupporterLinkUrl): Promise<string | undefined> {
  if (rawUrl !== undefined) {
    if (typeof rawUrl === "string") {
      return rawUrl;
    } else if (rawUrl.type === "github") {
      return "https://github.com/" + rawUrl.name;
    } else if (rawUrl.type === "twitter") {
      return "https://twitter.com/" + rawUrl.name;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}


export type Supporter = {name: string, linkUrl?: SupporterLinkUrl, avatarUrl?: SupporterAvatarUrl};
export type SupporterLinkUrl = string | {type: "github", name: string} | {type: "twitter", name: string};
export type SupporterAvatarUrl = string | {type: "github", name: string};

const RESPONSE_CONFIG = {
  cacheTime: 1 / 0,
  staleTime: 1 / 0,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false
};