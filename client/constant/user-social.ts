//

import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faBluesky, faDiscord, faXTwitter} from "@fortawesome/free-brands-svg-icons";
import {faGlobe, faLink} from "@fortawesome/sharp-regular-svg-icons";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export const USER_SOCIAL_TYPES = ["website", "x", "bluesky", "misskey", "note", "migdal", "discord", "other"] as const;
export type UserSocialType = LiteralType<typeof USER_SOCIAL_TYPES>;
export const UserSocialTypeUtil = LiteralUtilType.create(USER_SOCIAL_TYPES);

/** 各リンク種別に対応するアイコン。
 * Font Awesome に専用のブランドアイコンがない種別 (misskey, note, migdal など) には、暫定的に汎用アイコンを割り当てている (後でカスタムアイコンに差し替える予定)。*/
export const USER_SOCIAL_TYPE_ICONS = {
  website: faGlobe,
  x: faXTwitter,
  bluesky: faBluesky,
  misskey: faLink,
  note: faLink,
  migdal: faLink,
  discord: faDiscord,
  other: faLink
} satisfies Record<UserSocialType, IconDefinition>;
