//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";
import {GenerateMyApiKeyForm} from "/client/component/form/generate-my-api-key-form";
import {useMe} from "/client/hook/auth";


export const UserDeveloperPart = create(
  require("./user-developer-part.scss"), "UserDeveloperPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans} = useTrans("userDeveloperPart");

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.apiKey")}</h3>
          <GenerateMyApiKeyForm/>
        </section>
      </div>
    ) : null;

  }
);