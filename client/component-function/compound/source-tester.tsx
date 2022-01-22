//

import * as react from "react";
import {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useState
} from "react";
import Button from "/client/component-function/atom/button";
import Highlight from "/client/component-function/atom/highlight";
import AkrantiainExecutor from "/client/component-function/compound/akrantiain-executor";
import RegexpExecutor from "/client/component-function/compound/regexp-executor";
import ZatlinExecutor from "/client/component-function/compound/zatlin-executor";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";


const SourceTester = create(
  require("./source-tester.scss"), "SourceTester",
  function ({
    source,
    language
  }: {
    source: string,
    language: string
  }): ReactElement {

    let [executorOpen, setExecutorOpen] = useState(false);
    let [, {trans}] = useIntl();

    let node = (
      <Fragment>
        <form styleName="root">
          <Highlight value={source} language={language}/>
          <Button label={trans("sourceTester.try")} style="link" onClick={() => setExecutorOpen(true)}/>
        </form>
        <SourceTesterExecutor {...{source, language, executorOpen, setExecutorOpen}}/>
      </Fragment>
    );
    return node;

  }
);


const SourceTesterExecutor = create(
  require("./source-tester.scss"),
  function ({
    source,
    language,
    executorOpen,
    setExecutorOpen
  }: {
    source: string,
    language: string,
    executorOpen: boolean,
    setExecutorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement | null {

    if (language === "akrantiain") {
      let node = (
        <AkrantiainExecutor defaultSource={source} open={executorOpen} onClose={() => setExecutorOpen(false)}/>
      );
      return node;
    } else if (language === "zatlin") {
      let node = (
        <ZatlinExecutor defaultSource={source} open={executorOpen} onClose={() => setExecutorOpen(false)}/>
      );
      return node;
    } else if (language === "regexp") {
      let node = (
        <RegexpExecutor defaultSource={source} open={executorOpen} onClose={() => setExecutorOpen(false)}/>
      );
      return node;
    } else {
      return null;
    }

  }
);


export default SourceTester;