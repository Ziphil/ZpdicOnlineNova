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


const Footer = create(
  require("./footer.scss"), "Footer",
  function ({
    styles
  }: {
    styles?: StylesRecord
  }): ReactElement {

    let date = new Date();
    let yearString = date.getFullYear().toString();
    let node = (
      <footer styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="copyright">
              © 2020–{yearString} Ziphil<br/>
              <Link className={styles!["link"]} href="/document/other/privacy" style="plane">Privacy Policy</Link> · <Link className={styles!["link"]} href="/contact" style="plane">Contact</Link>
            </div>
          </div>
          <div styleName="right">
            <div styleName="copyright">
              This site is protected by reCAPTCHA.<br/>
              The Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
            </div>
          </div>
        </div>
      </footer>
    );
    return node;

  }
);


export default Footer;