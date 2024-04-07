//

import {faBook, faCircleInfo, faCog, faImage, faListCheck, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, Indicator, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client/component/atom/tab";
import {MainContainer} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useResponse, useSuspenseResponse} from "/client/hook/request";
import {DictionaryWithExecutors, NormalExampleOfferParameter} from "/client/skeleton";
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

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});
    const [canOwn] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "own"});

    const [[offers] = []] = useResponse("searchExampleOffers", (canEdit) && {parameter: NormalExampleOfferParameter.DAILY, size: 1, offset: 0});
    const [[offerExamples] = []] = useResponse("fetchExamplesByOffer", (canEdit && offers !== undefined && offers.length > 0) && {number: dictionary.number, offerId: offers[0].id, size: 1, offset: 0});
    const showOffer = canEdit && offers !== undefined && offerExamples !== undefined && offerExamples.length <= 0;

    return (
      <header styleName="root" {...rest}>
        <MainContainer styleName="container" width={width}>
          <DictionaryHeaderTop dictionary={dictionary}/>
          <TabList styleName="tab-list" value={tabValue ?? ""}>
            <LinkTab value="dictionary" href={`/dictionary/${dictionary.number}`}>
              <TabIconbag><GeneralIcon icon={faBook}/></TabIconbag>
              {trans("tab.dictionary")}
            </LinkTab>
            <Indicator styleName="indicator" scheme="secondary" disabled={!showOffer || tabValue === "example"} animate={true}>
              <LinkTab value="example" href={`/dictionary/${dictionary.number}/sentences`}>
                <TabIconbag><GeneralIcon icon={faQuotes}/></TabIconbag>
                {trans("tab.example")}
              </LinkTab>
            </Indicator>
            {(canOwn) && (
              <LinkTab value="commission" href={`/dictionary/${dictionary.number}/requests`}>
                <TabIconbag><GeneralIcon icon={faListCheck}/></TabIconbag>
                {trans("tab.commission")}
              </LinkTab>
            )}
            {(canEdit) && (
              <LinkTab value="resource" href={`/dictionary/${dictionary.number}/resources`}>
                <TabIconbag><GeneralIcon icon={faImage}/></TabIconbag>
                {trans("tab.resource")}
              </LinkTab>
            )}
            <LinkTab value="information" href={`/dictionary/${dictionary.number}/info`}>
              <TabIconbag><GeneralIcon icon={faCircleInfo}/></TabIconbag>
              {trans("tab.information")}
            </LinkTab>
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


export type DictionaryHeaderTabValue = "dictionary" | "example" | "resource" | "information" | "commission" | "setting" | null;