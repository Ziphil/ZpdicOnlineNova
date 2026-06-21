//

import {faBracketsSquare, faCamera, faEllipsis, faLink} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, RefObject, useCallback} from "react";
import {GeneralIcon, Menu, MenuItem, MenuItemIconbag, MenuSeparator, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useToast} from "/client/hook/toast";
import {copyToClipboard} from "/client/util/clipboard";
import {saveElementScreenshot} from "/client/util/screenshot";


export const ShareMenu = create(
  require("./share-menu.scss"), "ShareMenu",
  function ({
    sharedText,
    sharedUrl,
    markdownText,
    screenshotTarget,
    screenshotFileName,
    trigger,
    ...rest
  }: {
    sharedText: string,
    sharedUrl?: string,
    markdownText?: string,
    screenshotTarget?: RefObject<HTMLElement>,
    screenshotFileName?: string,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("shareMenu");
    const {dispatchInfoToast} = useToast();

    const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function" && navigator.canShare({text: sharedText, url: sharedUrl});

    const openShareWindow = useCallback(function (platform: SharePlatform): void {
      const windowUrl = getWindowUrl(platform, sharedText, sharedUrl);
      window.open(windowUrl, "share", "width=550,height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1");
    }, [sharedText, sharedUrl]);

    const copyUrl = useCallback(async function (): Promise<void> {
      try {
        await copyToClipboard(sharedUrl ?? "");
        dispatchInfoToast(trans("toast.copy"));
      } catch (error) {
        console.error(error);
      }
    }, [sharedUrl, trans, dispatchInfoToast]);

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
        await navigator.share({text: sharedText, url: sharedUrl});
      } catch (error) {
        console.error(error);
      }
    }, [sharedText, sharedUrl]);

    const saveScreenshot = useCallback(async function (): Promise<void> {
      try {
        if (screenshotTarget?.current) {
          await saveElementScreenshot(screenshotTarget.current, screenshotFileName ?? "screenshot.png");
          dispatchInfoToast(trans("toast.screenshot"));
        }
      } catch (error) {
        console.error(error);
      }
    }, [screenshotTarget, screenshotFileName, trans, dispatchInfoToast]);

    return (
      <Menu trigger={trigger} placement="bottom-end" {...rest}>
        {SHARE_PLATFORMS.map((platform) => (
          <MenuItem key={platform} onClick={() => openShareWindow(platform)}>
            {trans(`label.${platform}`)}
          </MenuItem>
        ))}
        <MenuSeparator/>
        {(!!sharedUrl) && (
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
        {(!!screenshotTarget) && (
          <MenuItem onClick={saveScreenshot}>
            <MenuItemIconbag><GeneralIcon icon={faCamera}/></MenuItemIconbag>
            {trans("label.saveScreenshot")}
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