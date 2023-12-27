//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {create} from "/client-new/component/create";


export const Hero = create(
  require("./hero.scss"), "Hero",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("topPage");

    return (
      <div styleName="root" {...rest}>
        <Logo styleName="logo"/>
        <p styleName="catch">
          {trans("catch")}
        </p>
      </div>
    );

  }
);
