//

import * as react from "react";
import {
  ReactElement
} from "react";
import Link from "/client/component/atom/link";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";


const Footer = create(
  require("./footer.scss"), "Footer",
  function ({
    styles
  }: {
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();

    const date = new Date();
    const yearString = date.getFullYear().toString();
    const node = (
      <footer styleName="root">
        <div styleName="content">
          <div styleName="left">
            <div styleName="copyright">
              © 2020–{yearString} Ziphil<br/>
            </div>
            <div styleName="copyright recaptcha">
              This site is protected by reCAPTCHA.<br/>
              The Google <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.
            </div>
          </div>
          <div styleName="right">
            <div>
              <Link className={styles!["link"]} href="/notification" style="plane">{trans("footer.notification")}</Link>
            </div>
            <div>
              <Link className={styles!["link"]} href="/document" style="plane">{trans("footer.document")}</Link>
            </div>
            <div/>
            <div>
              <Link className={styles!["link"]} href="/contact" style="plane">{trans("footer.contact")}</Link>
            </div>
          </div>
        </div>
      </footer>
    );
    return node;

  }
);


export default Footer;