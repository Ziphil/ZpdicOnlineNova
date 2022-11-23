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
  data
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


export default GoogleAd;