//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  RouteChildrenProps
} from "react-router-dom";
import {
  DictionaryListBody
} from "../../../server/type/dictionary";
import {
  applyStyle
} from "../../util/decorator";
import * as http from "../../util/http";
import {
  DictionaryList,
  Header,
  Menu
} from "../compound";


@applyStyle(require("./dashboard-page.scss"))
export class DashboardPage extends Component<DashboardPageProps, DashboardPageState> {

  public state: DashboardPageState = {
    dictionaries: []
  };

  public async componentDidMount(): Promise<void> {
    try {
      let response = await http.get<DictionaryListBody>("/api/dictionary/list");
      let dictionaries = response.data;
      this.setState({dictionaries});
    } catch (error) {
      this.context.router.push("/login");
    }
  }

  public render(): ReactNode {
    let mode = this.props.match?.params.mode || "dictionary";
    let contentNode;
    if (mode === "dictionary") {
      contentNode = <DictionaryList dictionaries={this.state.dictionaries}/>;
    }
    return (
      <div styleName="dashboard-page">
        <Header/>
        <div styleName="content-wrapper">
          <Menu mode={mode}/>
          <div styleName="content">
            {contentNode}
          </div>
        </div>
      </div>
    );
  }

}


type DashboardPageParams = {
  mode: string
};

type DashboardPageProps = RouteChildrenProps<DashboardPageParams> & {
};

type DashboardPageState = {
  dictionaries: DictionaryListBody;
};