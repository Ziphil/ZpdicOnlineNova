//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";


export const LimitView = create(
  require("./limit-view.scss"), "LimitView",
  function ({
    current,
    max,
    ...rest
  }: {
    current: number,
    max: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {transNode} = useTrans("limitView");

    const percent = current / max * 100;
    const type = (percent >= 90) ? "danger" : "normal";

    return (
      <div styleName="root" {...rest}>
        <div styleName="info">
          <div styleName="info-left">
            {transNode("value", {
              current,
              max,
              largeNumber: (parts) => <span styleName="large-number" data-type={type}>{parts}</span>,
              smallNumber: (parts) => <span styleName="small-number">{parts}</span>,
              slash: (parts) => <span styleName="slash">{parts}</span>
            })}
          </div>
          <div styleName="info-right">
            {transNode("percent", {
              percent,
              number: (parts) => <span styleName="large-number" data-type={type}>{parts}</span>,
              unit: (parts) => <span styleName="unit">{parts}</span>
            })}
          </div>
        </div>
        <div styleName="meter">
          <div styleName="meter-bar" style={{width: `${percent}%`}} data-type={type}/>
        </div>
      </div>
    );

  }
);
