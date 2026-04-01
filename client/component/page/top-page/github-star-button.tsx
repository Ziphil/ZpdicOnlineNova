//

import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faStar} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useQuery} from "react-query";
import {AdditionalProps, GeneralIcon, aria, useTrans} from "zographia";
import {create} from "/client/component/create";


export const GithubStarButton = create(
  require("./github-star-button.scss"), "GithubStarButton",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("topPage");

    const {data: starCount} = useQuery("github", async () => {
      const response = await fetch("https://api.github.com/repos/Ziphil/ZpdicOnlineNova");
      const data = await response.json() as Record<string, unknown>;
      if (response.status === 200 && "stargazers_count" in data) {
        const starCount = +(data["stargazers_count"] as number);
        return starCount;
      } else {
        throw new Error("cannot fetch");
      }
    }, RESPONSE_CONFIG);

    return (
      <a styleName="root" href="https://github.com/Ziphil/ZpdicOnlineNova" target="_blank" rel="noreferrer" {...rest}>
        <div styleName="star">
          <GeneralIcon styleName="github-icon" icon={faGithub}/>
          <div styleName="balloon">
            <GeneralIcon styleName="star-icon" icon={faStar}/>
            {transNumber(starCount)}
            <div styleName="arrow" {...aria({hidden: true})}/>
          </div>
        </div>
        <div styleName="text">
          {trans("subbutton.github")}
        </div>
      </a>
    );

  }
);


const RESPONSE_CONFIG = {
  cacheTime: 1 / 0,
  staleTime: 1 / 0,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false
};