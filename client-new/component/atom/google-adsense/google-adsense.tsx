//

import {ReactElement} from "react";
import {useMount} from "react-use";
import {data} from "zographia";
import {create} from "/client-new/component/create";


export const GoogleAdsense = create(
  null, "GoogleAdsense",
  function ({
    clientId,
    slotId
  }: {
    clientId: string,
    slotId: string
  }): ReactElement {

    useMount(() => {
      const anyWindow = window as any;
      if (anyWindow) {
        (anyWindow.adsbygoogle = anyWindow.adsbygoogle || []).push({});
      }
    });

    return (
      <ins
        className="adsbygoogle"
        style={{display: "block", width: "100%", height: "90px"}}
        {...data({
          adClient: `ca-pub-${clientId}`,
          adSlot: `${slotId}`
        })}
      />
    );

  }
);