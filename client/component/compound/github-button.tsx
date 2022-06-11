//

import axios from "axios";
import * as react from "react";
import {
  ReactElement
} from "react";
import {
  useQuery
} from "react-query";
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

    const {data: starCount} = useQuery("github", async () => {
      const url = "https://api.github.com/repos/Ziphil/ZpdicOnlineNova";
      const response = await axios.get(url, {validateStatus: () => true});
      if (response.status === 200 && "stargazers_count" in response.data) {
        const starCount = +response.data["stargazers_count"];
        return starCount;
      } else {
        throw new Error("cannot fetch");
      }
    }, {suspense: true});
    const [, {trans, transNumber}] = useIntl();

    const githubUrl = "https://github.com/Ziphil/ZpdicOnlineNova";
    const dashboardUrl = "https://ziphil.notion.site/ZpDIC-Online-987030f6505e4cf1ba8fe08121584d93";
    const node = (
      <div styleName="root">
        <a styleName="github" href={githubUrl} target="_blank" rel="noreferrer">
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
          <a styleName="text" href={dashboardUrl} target="_blank" rel="noreferrer">{trans("githubButton.dashboard")}</a>
        </div>
      </div>
    );
    return node;

  }
);


export default GithubButton;