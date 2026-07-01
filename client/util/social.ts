//

import {faBluesky, faDiscord, faXTwitter} from "@fortawesome/free-brands-svg-icons";
import {IconDefinition, faGlobe, faLink} from "@fortawesome/sharp-regular-svg-icons";
import {UserSocialType} from "/server/internal/skeleton";


const SOCIAL_SPEC = {
  website: [faGlobe, undefined],
  x: [faXTwitter, "#000000"],
  bluesky: [faBluesky, "#0A7AFF"],
  misskey: [faLink, "#86B300"],
  note: [faLink, "#000000"],
  migdal: [faLink, "#8FC31F"],
  discord: [faDiscord, "#5865F2"],
  other: [faLink, undefined]
} satisfies Record<UserSocialType, [IconDefinition, string | undefined]>;

export function getSocialIconDefinition(type: UserSocialType): IconDefinition {
  return SOCIAL_SPEC[type][0];
}

export function getSocialIconColor(type: UserSocialType): string | undefined {
  return SOCIAL_SPEC[type][1];
}
