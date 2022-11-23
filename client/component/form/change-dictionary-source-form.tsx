//

import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import TextArea from "/client/component/atom/text-area";
import AkrantiainExecutor from "/client/component/compound/akrantiain-executor";
import ZatlinExecutor from "/client/component/compound/zatlin-executor";
import {
  create
} from "/client/component/create";
import {
  invalidateQueries,
  usePopup,
  useRequest,
  useTrans
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
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [source, setSource] = useState(currentSource ?? "");
    const [executorOpen, setExecutorOpen] = useState(false);
    const {trans} = useTrans("changeDictionarySourceForm");
    const {request} = useRequest();
    const {addInformationPopup} = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const propertyName = language + "Source";
      const settings = {[propertyName]: source};
      const response = await request("changeDictionarySettings", {number, settings});
      if (response.status === 200) {
        addInformationPopup(`dictionarySettingsChanged.${propertyName}`);
        await onSubmit?.();
        await invalidateQueries("fetchDictionary", (data) => data.number === number);
      }
    }, [number, language, source, request, onSubmit, addInformationPopup]);

    const node = (
      <Fragment>
        <form styleName="root">
          <TextArea
            label={trans(language)}
            value={source}
            font="monospace"
            language={language}
            nowrap={true}
            onSet={(source) => setSource(source)}
          />
          <div styleName="button">
            <Button label={trans("try")} variant="light" onClick={() => setExecutorOpen(true)}/>
            <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
          </div>
        </form>
        {(language === "akrantiain") ? (
          <AkrantiainExecutor defaultSource={source} open={executorOpen} onClose={(event, source) => (setSource(source), setExecutorOpen(false))}/>
        ) : (language === "zatlin") ? (
          <ZatlinExecutor defaultSource={source} open={executorOpen} onClose={(event, source) => (setSource(source), setExecutorOpen(false))}/>
        ) : null}
      </Fragment>
    );
    return node;

  }
);


export default ChangeDictionarySourceForm;