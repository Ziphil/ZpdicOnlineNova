//

import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {faAngleRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";


export const DiscordButton = create(
  require("./discord-button.scss"), "DiscordButton",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("topPage");

    return (
      <a styleName="root" href="https://discord.gg/njswXRQTW7" target="_blank" rel="noreferrer" {...rest}>
        <div styleName="left">
          <GeneralIcon styleName="github-icon" icon={faDiscord}/>
        </div>
        <div styleName="right">
          <div styleName="server">Lang Lounge</div>
          <div styleName="channel">
            <GeneralIcon styleName="arrow" icon={faAngleRight}/>
            <span>外部サービス相談</span>
            <GeneralIcon styleName="arrow" icon={faAngleRight}/>
            <span>ZpDIC 相談</span>
          </div>
        </div>
      </a>
    );

  }
);