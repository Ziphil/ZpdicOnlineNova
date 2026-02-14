//

import {faBracketsSquare, faEllipsis, faLink} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {GeneralIcon, Menu, MenuItem, MenuItemIconbag, MenuSeparator, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useToast} from "/client/hook/toast";
import {copyToClipboard} from "/client/util/clipboard";


export const ShareMenu = create(
  require("./share-menu.scss"), "ShareMenu",
  function ({
    text,
    url,
    markdownText,
    trigger,
    ...rest
  }: {
    text: string,
    url?: string,
    markdownText?: string,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("shareMenu");
    const {dispatchInfoToast} = useToast();

    const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function" && navigator.canShare({text, url});

    const openShareWindow = useCallback(function (platform: SharePlatform): void {
      const windowUrl = getWindowUrl(platform, text, url);
      window.open(windowUrl, "share", "width=550,height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1");
    }, [text, url]);

    const copyUrl = useCallback(async function (): Promise<void> {
      try {
        await copyToClipboard(url ?? "");
        dispatchInfoToast(trans("toast.copy"));
      } catch (error) {
        console.error(error);
      }
    }, [url, trans, dispatchInfoToast]);

    const copyMarkdownText = useCallback(async function (): Promise<void> {
      try {
        await copyToClipboard(markdownText ?? "");
        dispatchInfoToast(trans("toast.copy"));
      } catch (error) {
        console.error(error);
      }
    }, [markdownText, trans, dispatchInfoToast]);

    const shareText = useCallback(async function (): Promise<void> {
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
        <MenuSeparator/>
        {(!!url) && (
          <MenuItem onClick={copyUrl}>
            <MenuItemIconbag><GeneralIcon icon={faLink}/></MenuItemIconbag>
            {trans("label.copyUrl")}
          </MenuItem>
        )}
        {(!!markdownText) && (
          <MenuItem onClick={copyMarkdownText}>
            <MenuItemIconbag><GeneralIcon icon={faBracketsSquare}/></MenuItemIconbag>
            {trans("label.copyMarkdownText")}
          </MenuItem>
        )}
        {(canShare) && (
          <MenuItem onClick={shareText}>
            <MenuItemIconbag><GeneralIcon icon={faEllipsis}/></MenuItemIconbag>
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
  } else if (platform === "bluesky") {
    return `https://bsky.app/intent/compose?text=${encodeURIComponent(text + ((url !== undefined) ? "\n" + url : ""))}`;
  } else if (platform === "misskey") {
    return `https://misskey.io/share?text=${encodeURIComponent(text)}` + ((url !== undefined) ? `&url=${encodeURIComponent(url)}` : "");
  } else {
    throw new Error("unsupported");
  }
}

const SHARE_PLATFORMS = ["twitter", "bluesky", "misskey"] as const;
type SharePlatform = (typeof SHARE_PLATFORMS)[number];