//

import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {create} from "/client-new/component/create";
import {VERSION} from "/client-new/variable";


export const Footer = create(
  require("./footer.scss"), "Footer",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("footer");

    const yearString = useMemo(() => dayjs().get("year").toString(), []);

    return (
      <footer styleName="root" {...rest}>
        <div styleName="left">
          <div styleName="title-container">
            <span styleName="title">ZpDIC Online</span>
            <span styleName="version">{VERSION}</span>
          </div>
          <div styleName="copyright">
            <span>© 2020–{yearString}</span>
            <span>Ziphil</span>
          </div>
          <MultiLineText styleName="recaptcha" lineHeight="narrow">
            This site is protected by reCAPTCHA.<br/>
            The Google <Link href="https://policies.google.com/privacy" variant="unstyledUnderline" target="_blank">Privacy Policy</Link> and <Link href="https://policies.google.com/terms" variant="unstyledUnderline" target="_blank">Terms of Service</Link> apply.
          </MultiLineText>
        </div>
        <div styleName="right">
          <Link scheme="gray" variant="unstyledUnderline" href="/notification">
            {trans("link.notification")}
          </Link>
          <Link scheme="gray" variant="unstyledUnderline" href="/contact">
            {trans("link.contact")}
          </Link>
          <Link scheme="gray" variant="unstyledUnderline" href="/document">
            {trans("link.document")}
          </Link>
        </div>
      </footer>
    );

  }
);