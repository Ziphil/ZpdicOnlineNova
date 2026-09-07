//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";
import {ChangeAppearanceForm} from "/client/component/form/change-appearance-form";


export const UserAppearancePart = create(
  require("./user-appearance-part.scss"), "UserAppearancePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userAppearancePart");

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.appearance")}</h3>
          <ChangeAppearanceForm/>
        </section>
      </div>
    );

  }
);