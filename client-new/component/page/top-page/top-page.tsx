//

import {faRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Suspense} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, MultiLineText, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {NotificationList} from "/client-new/component/compound/notification-list";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {GiftView} from "./gift-view";
import {GithubStarButton} from "./github-star-button";
import {Hero} from "./hero";
import {OverallAggregationPane} from "./overall-aggregation-pane";
import {Supporter, SupporterList} from "./supporter-list";


const SUPPORTERS = [
  {name: "ゆりです。", linkUrl: {type: "twitter", name: "udl_design"}, avatarUrl: "https://pbs.twimg.com/profile_images/1567141188788191232/8itkryuL_400x400.jpg"},
  {name: "bluebear94", linkUrl: {type: "github", name: "bluebear94"}, avatarUrl: {type: "github", name: "bluebear94"}},
  {name: "lynn", linkUrl: {type: "github", name: "lynn"}, avatarUrl: {type: "github", name: "lynn"}},
  {name: "nymwa", linkUrl: {type: "github", name: "nymwa"}, avatarUrl: {type: "github", name: "nymwa"}},
  {name: "川音リオ", linkUrl: "https://misskey.io/@KawaneRio", avatarUrl: "https://s3.arkjp.net/misskey/thumbnail-5bed03e1-1c67-4504-bc7a-b5d916e36ef3.webp"},
  {name: "Qunoxts", linkUrl: {type: "twitter", name: "Qunoxts"}, avatarUrl: "https://pbs.twimg.com/profile_images/1321519766830415872/8HbvaYFT_400x400.jpg"},
  {name: "炭酸ソーダ", linkUrl: {type: "twitter", name: "na2co3_ftw"}, avatarUrl: {type: "github", name: "na2co3-ftw"}}
] as Array<Supporter>;


export const TopPage = create(
  require("./top-page.scss"), "TopPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("topPage");

    return (
      <Page styleName="root" insertPadding={false} {...rest}>
        <div styleName="top">
          <Hero/>
          <OverallAggregationPane/>
        </div>
        <div styleName="main-outer">
          <MainContainer styleName="main">
            <Suspense>
              <section styleName="section">
                <h2 styleName="heading">{trans("heading.gift")}</h2>
                <GiftView/>
              </section>
              <section styleName="section">
                <h2 styleName="heading">{trans("heading.notification")}</h2>
                <NotificationList size={1} showPagination={false}/>
                <Link styleName="link" href="/notification" scheme="secondary" variant="underline">
                  <LinkIconbag><GeneralIcon icon={faRight}/></LinkIconbag>
                  {trans("subbutton.notification")}
                </Link>
              </section>
              <hr styleName="divider"/>
              <div styleName="row">
                <section styleName="section">
                  <h2 styleName="subheading">{trans("heading.supporter")}</h2>
                  <MultiLineText styleName="description">
                    {trans("description.supporter")}
                  </MultiLineText>
                  <SupporterList supporters={SUPPORTERS}/>
                </section>
                <section styleName="section">
                  <h2 styleName="subheading">{trans("heading.github")}</h2>
                  <MultiLineText styleName="description">
                    {trans("description.github")}
                  </MultiLineText>
                  <GithubStarButton/>
                </section>
              </div>
            </Suspense>
          </MainContainer>
        </div>
      </Page>
    );

  }
);
