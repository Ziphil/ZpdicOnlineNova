//

import {ReactElement, useCallback} from "react";
import {Menu, MenuItem, useTrans} from "zographia";
import {create} from "/client/component/create";


export const ShareMenu = create(
  require("./share-menu.scss"), "ShareMenu",
  function ({
    text,
    url,
    trigger,
    ...rest
  }: {
    text: string,
    url?: string,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("shareMenu");

    const canCopy = typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && typeof navigator.clipboard.writeText === "function";
    const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function" && navigator.canShare({text, url});

    const openShareWindow = useCallback(function (platform: SharePlatform): void {
      const windowUrl = getWindowUrl(platform, text, url);
      window.open(windowUrl, "share", "width=550,height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1");
    }, [text, url]);

    const copyText = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(url ?? "");
      } catch (error) {
        console.error(error);
      }
    }, [url]);

    const shareText = useCallback(async () => {
      try {
        await navigator.share({text, url});
      } catch (error) {
        console.error(error);
      }
    }, [text, url]);

    return (
      <Menu trigger={trigger} placement="bottom-end" {...rest}>
        {SHARE_PLATFORMS.map((platform) => (
          <MenuItem key={platform} onClick={() => openShareWindow(platform)}>
            {trans(`label.${platform}`)}
          </MenuItem>
        ))}
        {(canCopy) && (
          <MenuItem onClick={copyText}>
            {trans("label.copy")}
          </MenuItem>
        )}
        {(canShare) && (
          <MenuItem onClick={shareText}>
            {trans("label.other")}
          </MenuItem>
        )}
      </Menu>
    );

  }
);


function getWindowUrl(platform: SharePlatform, text: string, url?: string): string {
  if (platform === "twitter") {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}` + ((url !== undefined) ? `&url=${encodeURIComponent(url)}` : "");
  } else if (platform === "misskey") {
    return `https://misskey.io/share?text=${encodeURIComponent(text)}` + ((url !== undefined) ? `&url=${encodeURIComponent(url)}` : "");
  } else {
    throw new Error("unsupported");
  }
}

const SHARE_PLATFORMS = ["twitter", "misskey"] as const;
type SharePlatform = (typeof SHARE_PLATFORMS)[number];