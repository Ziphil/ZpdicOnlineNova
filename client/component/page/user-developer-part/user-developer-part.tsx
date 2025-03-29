//

import {faInfoCircle} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, Callout, CalloutBody, CalloutIconContainer, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
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

    const {trans, transNode} = useTrans("userDeveloperPart");

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.apiKey")}</h3>
          <MultiLineText styleName="description">
            {transNode("description.apiKey", {
              link: (parts) => <Link href="/document/other/api" variant="unstyledUnderline">{parts}</Link>
            })}
          </MultiLineText>
          <Callout styleName="callout">
            <CalloutIconContainer><GeneralIcon icon={faInfoCircle}/></CalloutIconContainer>
            <CalloutBody>
              <MultiLineText is="p">
                {trans("callout.apiKey")}
              </MultiLineText>
            </CalloutBody>
          </Callout>
          <GenerateMyApiKeyForm/>
        </section>
      </div>
    ) : null;

  }
);