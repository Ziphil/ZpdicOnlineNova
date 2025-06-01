//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";
import {ChangeAppearanceForm} from "/client/component/form/change-appearance-form";
import {useMe} from "/client/hook/auth";


export const UserAppearancePart = create(
  require("./user-appearance-part.scss"), "UserAppearancePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans} = useTrans("userAppearancePart");

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.appearance")}</h3>
          <ChangeAppearanceForm/>
        </section>
      </div>
    ) : null;

  }
);