//

import axios from "axios";
import {
  ReactElement
} from "react";
import {
  useQuery
} from "react-query";
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";


const ContributorList = create(
  require("./contributor-list.scss"), "ContributorList",
  function ({
    rawContributors
  }: {
    rawContributors: Array<RawContributor>
  }): ReactElement {

    const {trans} = useTrans("contributorList");

    const {data: contributors} = useQuery(["contributors", rawContributors], async () => {
      const promises = rawContributors.map(async (rawContributor) => {
        const name = rawContributor.name;
        const url = resolveUrl(rawContributor.url);
        const avatarUrl = await resolveAvatarUrl(rawContributor.avatarUrl);
        return {name, url, avatarUrl};
      });
      const contributors = await Promise.all(promises);
      return contributors;
    });

    const node = (
      <div styleName="root">
        <div styleName="head">{trans("title")}</div>
        <ul styleName="list">
          {contributors?.map((contributor) => (
            <li styleName="item" key={contributor.name}>
              {(contributor.avatarUrl !== undefined) && <img styleName="avatar" src={contributor.avatarUrl}/>}
              {(contributor.url !== undefined) ? <Link href={contributor.url}>{contributor.name}</Link> : contributor.name}
            </li>
          ))}
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
      const url = "https://api.github.com/users/" + rawAvatarUrl.github;
      const response = await axios.get(url, {validateStatus: () => true});
      if (response.status === 200) {
        const avatarUrl = response.data["avatar_url"];
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
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export type Contributor = {name: string, url?: string, avatarUrl?: string};
export type RawContributor = {name: string, url?: string | {github: string} | {twitter: string}, avatarUrl?: string | {github: string}};

export default ContributorList;