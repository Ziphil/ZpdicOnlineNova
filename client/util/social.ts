//

import {faBluesky, faDiscord, faXTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons";
import {IconDefinition, faHouse, faLink} from "@fortawesome/sharp-regular-svg-icons";
import {fakMigdal, fakMisskey, fakNote} from "/client/component/atom/icon";
import {UserSocialType} from "/server/internal/skeleton";


const SOCIAL_SPEC = {
  x: [faXTwitter, "#000000"],
  bluesky: [faBluesky, "#0A7AFF"],
  misskey: [fakMisskey, "#86B300"],
  youtube: [faYoutube, "#FF0000"],
  note: [fakNote, "#000000"],
  migdal: [fakMigdal, "#8FC31F"],
  discord: [faDiscord, "#5865F2"],
  website: [faHouse, undefined],
  other: [faLink, undefined]
} satisfies Record<UserSocialType, [IconDefinition, string | undefined]>;

export function getSocialIconDefinition(type: UserSocialType): IconDefinition {
  return SOCIAL_SPEC[type][0];
}

export function getSocialIconColor(type: UserSocialType): string | undefined {
  return SOCIAL_SPEC[type][1];
}
