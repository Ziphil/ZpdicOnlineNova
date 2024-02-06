/* eslint-disable react/jsx-closing-bracket-location */

import {faPalette, faPen, faUsers} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {Outlet, useParams} from "react-router-dom";
import {AdditionalProps, GeneralIcon, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client-new/component/atom/tab";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";


export const DictionarySettingPage = create(
  require("./dictionary-setting-page.scss"), "DictionarySettingPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingPage");

    const {tabValue} = useParams();
    const dictionary = useDictionary();

    return (
      <Page {...rest} insertPadding={{top: false, bottom: true, horizontal: true}} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={dictionary} tabValue="setting"/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <TabList styleName="tab-list" value={tabValue || "appearance"} scheme="primary">
            <LinkTab value="appearance" href={`/dictionary/${dictionary.number}/settings`}>
              <TabIconbag><GeneralIcon icon={faPalette}/></TabIconbag>
              {trans("tab.appearance")}
            </LinkTab>
            <LinkTab value="editing" href={`/dictionary/${dictionary.number}/settings/editing`}>
              <TabIconbag><GeneralIcon icon={faPen}/></TabIconbag>
              {trans("tab.editing")}
            </LinkTab>
            <LinkTab value="authority" href={`/dictionary/${dictionary.number}/settings/access`}>
              <TabIconbag><GeneralIcon icon={faUsers}/></TabIconbag>
              {trans("tab.authority")}
            </LinkTab>
          </TabList>
          <Outlet context={{dictionary}}/>
        </MainContainer>
      </Page>
    );

  }
);