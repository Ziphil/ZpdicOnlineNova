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

    let url = "https://github.com/Ziphil/ZpdicOnlineNova";
    let node = (
      <a styleName="root" href={url} target="_blank">
        <div styleName="icon-wrapper">
          <div styleName="icon">&#xF09B;</div>
          <div styleName="star-wrapper">
            <span styleName="star">&#xF005;</span>
            <span styleName="count">{transNumber(starCount)}</span>
          </div>
        </div>
        <div styleName="text">{trans("githubButton.text")}</div>
      </a>
    );
    return node;

  }
);


export default GithubButton;