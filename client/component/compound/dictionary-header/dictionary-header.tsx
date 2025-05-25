//

import {faBook, faCircleInfo, faCog, faImage, faListCheck, faQuotes, faScroll} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useMatch} from "react-router-dom";
import {AdditionalProps, GeneralIcon, Indicator, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client/component/atom/tab";
import {MainContainer} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useResponse, useSuspenseResponse} from "/client/hook/request";
import {DictionaryWithExecutors} from "/client/skeleton";
import {DictionaryHeaderTop} from "./dictionary-header-top";


export const DictionaryHeader = create(
  require("./dictionary-header.scss"), "DictionaryHeader",
  function ({
    dictionary,
    width = "normal",
    tabValue,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    width?: "normal" | "wide",
    tabValue: DictionaryHeaderTabValue,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    const [authorities] = useSuspenseResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});

    const [[, proposalSize] = []] = useResponse("fetchProposals", {number: dictionary.number, size: 1, offset: 0});

    const match = useMatch("/dictionary/:identifier/:tabPath?/:subTabPath?");

    return (
      <header styleName="root" {...rest}>
        <MainContainer styleName="container" width={width}>
          <DictionaryHeaderTop dictionary={dictionary}/>
          <TabList styleName="tab-list" value={tabValue ?? ""}>
            <LinkTab value="dictionary" href={`/dictionary/${match?.params.identifier}`}>
              <TabIconbag><GeneralIcon icon={faBook}/></TabIconbag>
              {trans("tab.dictionary")}
            </LinkTab>
            <LinkTab value="example" href={`/dictionary/${match?.params.identifier}/sentences`}>
              <TabIconbag><GeneralIcon icon={faQuotes}/></TabIconbag>
              {trans("tab.example")}
            </LinkTab>
            <LinkTab value="article" href={`/dictionary/${match?.params.identifier}/articles`}>
              <TabIconbag><GeneralIcon icon={faScroll}/></TabIconbag>
              {trans("tab.article")}
            </LinkTab>
            {(authorities.includes("edit")) && (
              <Indicator styleName="indicator" scheme="secondary" disabled={(proposalSize === undefined || proposalSize <= 0) || tabValue === "proposal"} animate={true}>
                <LinkTab value="proposal" href={`/dictionary/${match?.params.identifier}/requests`}>
                  <TabIconbag><GeneralIcon icon={faListCheck}/></TabIconbag>
                  {trans("tab.proposal")}
                </LinkTab>
              </Indicator>
            )}
            {(authorities.includes("edit")) && (
              <LinkTab value="resource" href={`/dictionary/${match?.params.identifier}/resources`}>
                <TabIconbag><GeneralIcon icon={faImage}/></TabIconbag>
                {trans("tab.resource")}
              </LinkTab>
            )}
            <LinkTab value="information" href={`/dictionary/${match?.params.identifier}/info`}>
              <TabIconbag><GeneralIcon icon={faCircleInfo}/></TabIconbag>
              {trans("tab.information")}
            </LinkTab>
            {(authorities.includes("own")) && (
              <LinkTab value="setting" href={`/dictionary/${match?.params.identifier}/settings`}>
                <TabIconbag><GeneralIcon icon={faCog}/></TabIconbag>
                {trans("tab.setting")}
              </LinkTab>
            )}
          </TabList>
        </MainContainer>
      </header>
    );

  }
);


export type DictionaryHeaderTabValue = "dictionary" | "example" | "article" | "resource" | "information" | "proposal" | "setting" | null;