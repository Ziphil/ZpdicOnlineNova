//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  RouteComponentProps,
  withRouter
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
class DashboardPageBase extends Component<RouteComponentProps<Params> & Props, State> {

  public state: State = {
    dictionaries: []
  };

  public async componentDidMount(): Promise<void> {
    try {
      let response = await http.get<DictionaryListBody>("/api/dictionary/list");
      let dictionaries = response.data;
      this.setState({dictionaries});
    } catch (error) {
      this.props.history.push("/login");
    }
  }

  public render(): ReactNode {
    let mode = this.props.match?.params.mode || "dictionary";
    let contentNode;
    if (mode === "dictionary") {
      contentNode = <DictionaryList dictionaries={this.state.dictionaries}/>;
    } else {
      contentNode = "Nothing";
    }
    let node = (
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
    return node;
  }

}


type Params = {
  mode: string
};
type Props = {
};
type State = {
  dictionaries: DictionaryListBody;
};

export let DashboardPage = withRouter(DashboardPageBase);