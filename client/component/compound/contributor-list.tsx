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
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";


const ContributorList = create(
  require("./contributor-list.scss"), "ContributorList",
  function ({
    rawContributors
  }: {
    rawContributors: Array<RawContributor>
  }): ReactElement {

    let [contributors, setContributors] = useState<Array<Contributor>>([]);
    let [, {trans}] = useIntl();

    useMount(async () => {
      let promises = rawContributors.map(async (rawContributor) => {
        let name = rawContributor.name;
        let url = resolveUrl(rawContributor.url);
        let avatarUrl = await resolveAvatarUrl(rawContributor.avatarUrl);
        return {name, url, avatarUrl};
      });
      let contributors = await Promise.all(promises);
      setContributors(contributors);
    });

    let contributorNodes = contributors.map((contributor) => {
      let avatarNode = (contributor.avatarUrl !== undefined) && <img styleName="avatar" src={contributor.avatarUrl}/>;
      let nameNode = (contributor.url !== undefined) ? <Link href={contributor.url}>{contributor.name}</Link> : contributor.name;
      let contributorNode = (
        <li styleName="item" key={contributor.name}>
          {avatarNode}
          {nameNode}
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


async function resolveAvatarUrl(rawAvatarUrl?: string | {github: string}): Promise<string | undefined> {
  if (rawAvatarUrl !== undefined) {
    if (typeof rawAvatarUrl === "string") {
      return rawAvatarUrl;
    } else {
      let url = "https://api.github.com/users/" + rawAvatarUrl.github;
      let response = await axios.get(url, {validateStatus: () => true});
      if (response.status === 200) {
        let avatarUrl = response.data["avatar_url"];
        return avatarUrl;
      } else {
        return undefined;
      }
    }
  } else {
    return undefined;
  }
}

function resolveUrl(rawUrl?: string | {github: string} | {twitter: string}): string | undefined {
  if (rawUrl !== undefined) {
    if (typeof rawUrl === "string") {
      return rawUrl;
    } else if ("github" in rawUrl) {
      return "https://github.com/" + rawUrl.github;
    } else if ("twitter" in rawUrl) {
      return "https://twitter.com/" + rawUrl.twitter;
    }
  } else {
    return undefined;
  }
}

export type Contributor = {name: string, url?: string, avatarUrl?: string};
export type RawContributor = {name: string, url?: string | {github: string} | {twitter: string}, avatarUrl?: string | {github: string}};

export default ContributorList;