//

import axios from "axios";
import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./github-button.scss"))
export default class GithubButton extends Component<Props, State> {

  public state: State = {
    starCount: null
  };

  public async componentDidMount(): Promise<void> {
    let url = "https://api.github.com/repos/Ziphil/ZpdicOnlineNova";
    let response = await axios.get(url, {validateStatus: () => true});
    if (response.status === 200 && "stargazers_count" in response.data) {
      let starCount = response.data["stargazers_count"];
      this.setState({starCount});
    } else {
      this.setState({starCount: null});
    }

  }

  public render(): ReactNode {
    let url = "https://github.com/Ziphil/ZpdicOnlineNova";
    let node = (
      <a styleName="root" href={url} target="_blank">
        <div styleName="icon-wrapper">
          <div styleName="icon">&#xF113;</div>
          <div styleName="star-wrapper">
            <span styleName="star">&#xF005;</span>
            <span styleName="count">{this.transNumber(this.state.starCount)}</span>
          </div>
        </div>
        <div styleName="text">{this.trans("githubButton.text")}</div>
      </a>
    );
    return node;
  }

}


type Props = {
};
type State = {
  starCount: number | null
};