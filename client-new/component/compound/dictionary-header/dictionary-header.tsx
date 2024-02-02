//

import {faBook, faCircleInfo, faCog, faListCheck, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, SingleLineText, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client-new/component/atom/tab";
import {MainContainer} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {DetailedDictionary} from "/client-new/skeleton";


export const DictionaryHeader = create(
  require("./dictionary-header.scss"), "DictionaryHeader",
  function ({
    dictionary,
    width = "normal",
    tabValue,
    ...rest
  }: {
    dictionary: DetailedDictionary,
    width?: "normal" | "wide",
    tabValue: "dictionary" | "example" | "information" | "setting" | null,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    const [canOwn] = useSuspenseResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "own"});

    return (
      <header styleName="root" {...rest}>
        <MainContainer width={width}>
          <SingleLineText styleName="name" is="h2">
            {dictionary.name}
          </SingleLineText>
          <TabList styleName="tab-list" value={tabValue ?? ""}>
            <LinkTab value="dictionary" href={`/dictionary/${dictionary.number}`}>
              <TabIconbag><GeneralIcon icon={faBook}/></TabIconbag>
              {trans("tab.dictionary")}
            </LinkTab>
            <LinkTab value="example" href={`/dictionary/${dictionary.number}/sentences`}>
              <TabIconbag><GeneralIcon icon={faQuotes}/></TabIconbag>
              {trans("tab.example")}
            </LinkTab>
            <LinkTab value="information" href={`/dictionary/${dictionary.number}/info`}>
              <TabIconbag><GeneralIcon icon={faCircleInfo}/></TabIconbag>
              {trans("tab.information")}
            </LinkTab>
            {(canOwn) && (
              <LinkTab value="commission" href={`/dictionary/${dictionary.number}/requests`}>
                <TabIconbag><GeneralIcon icon={faListCheck}/></TabIconbag>
                {trans("tab.commission")}
              </LinkTab>
            )}
            {(canOwn) && (
              <LinkTab value="setting" href={`/dictionary/${dictionary.number}/settings`}>
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