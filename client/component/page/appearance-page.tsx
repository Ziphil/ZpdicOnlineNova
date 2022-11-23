//

import {
  ReactElement,
  Suspense
} from "react";
import Loading from "/client/component/compound/loading";
import Menu from "/client/component/compound/menu";
import MenuItem from "/client/component/compound/menu-item";
import SettingPane from "/client/component/compound/setting-pane";
import {
  create
} from "/client/component/create";
import ChangeLanguageForm from "/client/component/form/change-language-form";
import ChangeThemeForm from "/client/component/form/change-theme-form";
import {
  useLocation,
  useTrans
} from "/client/component/hook";
import Page from "/client/component/page/page";


const AppearancePage = create(
  require("./appearance-page.scss"), "AppearancePage",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("appearancePage");
    const location = useLocation();

    const mode = location.hash || "appearance";
    const node = (
      <Page title={trans("title")}>
        <Menu mode={mode}>
          <MenuItem mode="appearance" label={trans("appearance")} iconName="brush" href="#appearance"/>
        </Menu>
        <AppearancePageForms {...{mode}}/>
      </Page>
    );
    return node;

  }
);


const AppearancePageForms = create(
  require("./appearance-page.scss"),
  function ({
    mode
  }: {
    mode: string
  }): ReactElement | null {

    const {trans} = useTrans("appearancePage");

    if (mode === "appearance") {
      const node = (
        <Suspense fallback={<AppearancePageLoading/>}>
          <SettingPane
            label={trans("changeLanguageForm.label")}
            description={trans("changeLanguageForm.description")}
          >
            <ChangeLanguageForm/>
          </SettingPane>
          <SettingPane
            label={trans("changeThemeForm.label")}
            description={trans("changeThemeForm.description")}
          >
            <ChangeThemeForm/>
          </SettingPane>
        </Suspense>
      );
      return node;
    } else {
      return null;
    }

  }
);


const AppearancePageLoading = create(
  require("./appearance-page.scss"),
  function ({
  }: {
  }): ReactElement {

    const node = (
      <SettingPane>
        <Loading/>
      </SettingPane>
    );
    return node;

  }
);


export default AppearancePage;