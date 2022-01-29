//

import axios from "axios";
import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import {
  useMount
} from "react-use";
import Icon from "/client/component/atom/icon";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";


const GithubButton = create(
  require("./github-button.scss"), "GithubButton",
  function ({
  }: {
  }): ReactElement {

    let [starCount, setStarCount] = useState<number | null>(null);
    let [, {trans, transNumber}] = useIntl();

    useMount(async () => {
      let url = "https://api.github.com/repos/Ziphil/ZpdicOnlineNova";
      let response = await axios.get(url, {validateStatus: () => true});
      if (response.status === 200 && "stargazers_count" in response.data) {
        let starCount = +response.data["stargazers_count"];
        setStarCount(starCount);
      } else {
        setStarCount(null);
      }
    });

    let githubUrl = "https://github.com/Ziphil/ZpdicOnlineNova";
    let dashboardUrl = "https://ziphil.notion.site/ZpDIC-Online-987030f6505e4cf1ba8fe08121584d93";
    let node = (
      <div styleName="root">
        <a styleName="github" href={githubUrl} target="_blank">
          <div styleName="icon-wrapper">
            <div styleName="icon"><Icon name="github"/></div>
            <div styleName="star-wrapper">
              <span styleName="star"><Icon name="star"/></span>
              <span styleName="count">{transNumber(starCount)}</span>
            </div>
          </div>
          <div styleName="text">{trans("githubButton.github")}</div>
        </a>
        <div styleName="dashboard">
          <a styleName="text" href={dashboardUrl} target="_blank">{trans("githubButton.dashboard")}</a>
        </div>
      </div>
    );
    return node;

  }
);


export default GithubButton;