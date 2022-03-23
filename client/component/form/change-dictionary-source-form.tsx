//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import TextArea from "/client/component/atom/text-area";
import AkrantiainExecutor from "/client/component/compound/akrantiain-executor";
import ZatlinExecutor from "/client/component/compound/zatlin-executor";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";


const ChangeDictionarySourceForm = create(
  require("./change-dictionary-source-form.scss"), "ChangeDictionarySourceForm",
  function ({
    number,
    currentSource,
    language,
    onSubmit
  }: {
    number: number,
    currentSource: string | undefined,
    language: "akrantiain" | "zatlin",
    onSubmit?: () => void
  }): ReactElement {

    let [source, setSource] = useState(currentSource ?? "");
    let [executorOpen, setExecutorOpen] = useState(false);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let propertyName = language + "Source";
      let settings = {[propertyName]: source};
      let response = await request("changeDictionarySettings", {number, settings});
      if (response.status === 200) {
        addInformationPopup(`dictionarySettingsChanged.${propertyName}`);
        onSubmit?.();
      }
    }, [number, language, source, request, onSubmit, addInformationPopup]);

    let executorNode = (() => {
      if (language === "akrantiain") {
        let executorNode = (
          <AkrantiainExecutor defaultSource={source} open={executorOpen} onClose={(event, source) => (setSource(source), setExecutorOpen(false))}/>
        );
        return executorNode;
      } else if (language === "zatlin") {
        let executorNode = (
          <ZatlinExecutor defaultSource={source} open={executorOpen} onClose={(event, source) => (setSource(source), setExecutorOpen(false))}/>
        );
        return executorNode;
      }
    })();
    let node = (
      <Fragment>
        <form styleName="root">
          <TextArea
            label={trans(`changeDictionarySourceForm.${language}`)}
            value={source}
            font="monospace"
            language={language}
            nowrap={true}
            onSet={(source) => setSource(source)}
          />
          <div styleName="button">
            <Button label={trans("changeDictionarySourceForm.try")} variant="link" onClick={() => setExecutorOpen(true)}/>
            <Button label={trans("changeDictionarySourceForm.confirm")} reactive={true} onClick={handleClick}/>
          </div>
        </form>
        {executorNode}
      </Fragment>
    );
    return node;

  }
);


export default ChangeDictionarySourceForm;