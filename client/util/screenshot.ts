//

import {toBlob} from "html-to-image";
import downloadFile from "js-file-download";


const SCREENSHOT_PADDING = 12;

export async function saveElementScreenshot(element: HTMLElement, fileName: string): Promise<void> {
  const blob = await toBlob(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#FFFFFF",
    width: element.offsetWidth + SCREENSHOT_PADDING * 2,
    height: element.offsetHeight + SCREENSHOT_PADDING * 2,
    style: {boxSizing: "border-box", padding: `${SCREENSHOT_PADDING}px`, margin: "0px"}
  });
  if (blob !== null) {
    downloadFile(blob, fileName);
  } else {
    throw new Error("failed to capture screenshot");
  }
}
