//

import axios from "axios";
import * as react from "react";
import {
  ReactNode
} from "react";
import Link from "/client/component/atom/link";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./contributor-list.scss"))
export default class ContributorList extends Component<Props, State> {

  public state: State = {
    contributors: []
  };

  public async componentDidMount(): Promise<void> {
    let ids = ["lynn", "bluebear94"];
    let promises = ids.map(async (id) => {
      let url = "https://api.github.com/users/" + id;
      let response = await axios.get(url, {validateStatus: () => true});
      if (response.status === 200) {
        let name = response.data["name"];
        let avatarUrl = response.data["avatar_url"];
        return {id, name, avatarUrl};
      } else {
        let name = "@" + id;
        return {id, name};
      }
    });
    let contributors = await Promise.all(promises);
    this.setState({contributors});
  }

  public render(): ReactNode {
    let contributorNodes = this.state.contributors.map((contributor) => {
      let url = "https://github.com/" + contributor.id;
      let avatarNode = (contributor.avatarUrl !== undefined) && <img styleName="avatar" src={contributor.avatarUrl}/>;
      let contributorNode = (
        <li styleName="item" key={contributor.id}>
          {avatarNode}
          <Link href={url}>{contributor.name}</Link>
        </li>
      );
      return contributorNode;
    });
    let node = (
      <div styleName="root">
        <div styleName="head">{this.trans("contributorList.title")}</div>
        <ul styleName="list">
          {contributorNodes}
        </ul>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  contributors: Array<{id: string, name: string, avatarUrl?: string}>
};