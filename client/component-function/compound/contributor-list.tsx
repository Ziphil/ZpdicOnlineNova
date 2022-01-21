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
import Link from "/client/component-function/atom/link";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";


const RAW_CONTRIBUTORS = [
  {github: "lynn"},
  {github: "bluebear94", name: "bluebear94"},
  {github: "nymwa", name: "nymwa"}
];


const ContributorList = create(
  require("./contributor-list.scss"), "ContributorList",
  function ({
  }: {
  }): ReactElement {

    let [contributors, setContributors] = useState<Array<Contributor>>([]);
    let [, {trans}] = useIntl();

    useMount(async () => {
      let promises = RAW_CONTRIBUTORS.map(async (rawContributor) => {
        if ("github" in rawContributor) {
          let url = "https://api.github.com/users/" + rawContributor.github;
          let response = await axios.get(url, {validateStatus: () => true});
          if (response.status === 200) {
            let id = rawContributor.github;
            let name = rawContributor.name ?? response.data["name"];
            let url = "https://github.com/" + id;
            let avatarUrl = response.data["avatar_url"];
            return {name, url, avatarUrl};
          } else {
            let name = "@" + rawContributor.github;
            let url = "https://github.com/" + rawContributor.github;
            return {name, url};
          }
        } else {
          return rawContributor;
        }
      });
      let contributors = await Promise.all(promises);
      setContributors(contributors);
    });

    let contributorNodes = contributors.map((contributor) => {
      let avatarNode = (contributor.avatarUrl !== undefined) && <img styleName="avatar" src={contributor.avatarUrl}/>;
      let contributorNode = (
        <li styleName="item" key={contributor.name}>
          {avatarNode}
          <Link href={contributor.url}>{contributor.name}</Link>
        </li>
      );
      return contributorNode;
    });
    let node = (
      <div styleName="root">
        <div styleName="head">{trans("contributorList.title")}</div>
        <ul styleName="list">
          {contributorNodes}
        </ul>
      </div>
    );
    return node;

  }
);


export type Contributor = {name: string, url: string, avatarUrl?: string};
export type RawContributor = {github: string, name?: string} | {name: string, url: string, avatarUrl?: string};

export default ContributorList;