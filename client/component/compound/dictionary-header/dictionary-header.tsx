//

import {faBook, faCircleInfo, faCog, faImage, faListCheck, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useMatch} from "react-router-dom";
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
    const [[offerExamples] = []] = useResponse("fetchExamplesByOffer", (canEdit && offers !== undefined && offers.length > 0) && {number: dictionary.number, offer: offers[0], size: 1, offset: 0});
    const showOffer = canEdit && offers !== undefined && offerExamples !== undefined && offerExamples.length <= 0;

    const [[, commissionSize] = []] = useResponse("fetchCommissions", {number: dictionary.number, size: 1, offset: 0});

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
            <Indicator styleName="indicator" scheme="secondary" disabled={!showOffer || tabValue === "example"} animate={true}>
              <LinkTab value="example" href={`/dictionary/${match?.params.identifier}/sentences`}>
                <TabIconbag><GeneralIcon icon={faQuotes}/></TabIconbag>
                {trans("tab.example")}
              </LinkTab>
            </Indicator>
            {(canOwn) && (
              <Indicator styleName="indicator" scheme="secondary" disabled={(commissionSize === undefined || commissionSize <= 0) || tabValue === "commission"} animate={true}>
                <LinkTab value="commission" href={`/dictionary/${match?.params.identifier}/requests`}>
                  <TabIconbag><GeneralIcon icon={faListCheck}/></TabIconbag>
                  {trans("tab.commission")}
                </LinkTab>
              </Indicator>
            )}
            {(canEdit) && (
              <LinkTab value="resource" href={`/dictionary/${match?.params.identifier}/resources`}>
                <TabIconbag><GeneralIcon icon={faImage}/></TabIconbag>
                {trans("tab.resource")}
              </LinkTab>
            )}
            <LinkTab value="information" href={`/dictionary/${match?.params.identifier}/info`}>
              <TabIconbag><GeneralIcon icon={faCircleInfo}/></TabIconbag>
              {trans("tab.information")}
            </LinkTab>
            {(canOwn) && (
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


export type DictionaryHeaderTabValue = "dictionary" | "example" | "resource" | "information" | "commission" | "setting" | null;