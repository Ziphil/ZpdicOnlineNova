//

import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText} from "zographia";
import {create} from "/client-new/component/create";


export const Footer = create(
  require("./footer.scss"), "Footer",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const yearString = useMemo(() => dayjs().get("year").toString(), []);

    const node = (
      <footer styleName="root" {...rest}>
        <div styleName="left">
          <div styleName="copyright">
            © 2020–{yearString} Ziphil<br/>
          </div>
          <MultiLineText styleName="recaptcha" lineHeight="short">
            This site is protected by reCAPTCHA.<br/>
            The Google <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.
          </MultiLineText>
        </div>
        <div styleName="right">
        </div>
      </footer>
    );
    return node;

  }
);