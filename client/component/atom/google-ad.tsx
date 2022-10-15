//

import {
  ReactElement
} from "react";
import {
  useMount
} from "react-use";
import {
  create
} from "/client/component/create";
import {
  DataUtil
} from "/client/util/data";


const GoogleAd = create(
  null, "GoogleAd",
  function ({
    clientId,
    slotId
  }: {
    clientId: string,
    slotId: string
  }): ReactElement | null {

    useMount(() => {
      const element = document.createElement("script");
      element.id = "google-ads-sdk";
      element.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      element.crossOrigin = "anonymous";
      element.async = true;
      element.onload = function (): void {
        const anyWindow = window as any;
        if (anyWindow.adsbygoogle) {
          anyWindow.adsbygoogle.push({});
        }
      };
      document.head.appendChild(element);
    });

    const data = DataUtil.create({
      adClient: `ca-pub-${clientId}`,
      adSlot: `${slotId}`
    });
    return (
      <ins
        className="adsbygoogle"
        style={{display: "block", width: "100%", height: "90px"}}
        {...data}
      />
    );

  }
);


export default GoogleAd;