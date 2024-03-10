//

import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {ContactForm} from "/client/component/compound/contact-form";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";


export const ContactPage = create(
  require("./contact-page.scss"), "ContactPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("contactPage");

    return (
      <Page styleName="root" title={trans("title")} headerNode={<Header/>} {...rest}>
        <MainContainer width="narrow">
          <h2 styleName="heading">{trans("heading")}</h2>
          <MultiLineText styleName="explanation" is="p">
            {trans("explanation")}
          </MultiLineText>
          <ContactForm/>
        </MainContainer>
      </Page>
    );

  }
);
