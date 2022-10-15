//

import {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Highlight from "/client/component/atom/highlight";
import AkrantiainExecutor from "/client/component/compound/akrantiain-executor";
import RegexpExecutor from "/client/component/compound/regexp-executor";
import ZatlinExecutor from "/client/component/compound/zatlin-executor";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";


const SourceTester = create(
  require("./source-tester.scss"), "SourceTester",
  function ({
    source,
    language
  }: {
    source: string,
    language: string
  }): ReactElement {

    const [executorOpen, setExecutorOpen] = useState(false);
    const [, {trans}] = useIntl();

    const node = (
      <Fragment>
        <form styleName="root">
          <Highlight source={source} language={language}/>
          <Button label={trans("sourceTester.try")} variant="link" onClick={() => setExecutorOpen(true)}/>
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
      const node = (
        <AkrantiainExecutor defaultSource={source} open={executorOpen} onClose={() => setExecutorOpen(false)}/>
      );
      return node;
    } else if (language === "zatlin") {
      const node = (
        <ZatlinExecutor defaultSource={source} open={executorOpen} onClose={() => setExecutorOpen(false)}/>
      );
      return node;
    } else if (language === "regexp") {
      const node = (
        <RegexpExecutor defaultSource={source} open={executorOpen} onClose={() => setExecutorOpen(false)}/>
      );
      return node;
    } else {
      return null;
    }

  }
);


export default SourceTester;