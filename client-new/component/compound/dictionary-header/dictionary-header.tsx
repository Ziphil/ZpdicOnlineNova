//

import {faBook, faCircleInfo, faCog, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, SingleLineText, Tab, TabIconbag, TabList, useTrans} from "zographia";
import {MainContainer} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {DetailedDictionary} from "/client-new/skeleton";


export const DictionaryHeader = create(
  require("./dictionary-header.scss"), "DictionaryHeader",
  function ({
    dictionary,
    tabValue,
    ...rest
  }: {
    dictionary: DetailedDictionary,
    tabValue: "dictionary" | "example" | "info" | null,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    const [canOwn] = useSuspenseResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "own"});

    return (
      <header styleName="root" {...rest}>
        <MainContainer width="wide">
          <SingleLineText styleName="name" is="h2">
            {dictionary.name}
          </SingleLineText>
          <TabList styleName="tab-list" value={tabValue ?? ""}>
            <Tab value="dictionary">
              <TabIconbag><GeneralIcon icon={faBook}/></TabIconbag>
              {trans("tab.dictionary")}
            </Tab>
            <Tab value="example">
              <TabIconbag><GeneralIcon icon={faQuotes}/></TabIconbag>
              {trans("tab.example")}
            </Tab>
            {(canOwn) ? (
              <Tab value="info">
                <TabIconbag><GeneralIcon icon={faCog}/></TabIconbag>
                {trans("tab.setting")}
              </Tab>
            ) : (
              <Tab value="info">
                <TabIconbag><GeneralIcon icon={faCircleInfo}/></TabIconbag>
                {trans("tab.info")}
              </Tab>
            )}
          </TabList>
        </MainContainer>
      </header>
    );

  }
);