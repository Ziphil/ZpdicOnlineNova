//

import {
  AKRANTIAIN_VERSION,
  Akrantiain
} from "akrantiain";
import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component-function/atom/button";
import Input from "/client/component-function/atom/input";
import Overlay from "/client/component-function/atom/overlay";
import TextArea from "/client/component-function/atom/text-area";
import {
  StylesRecord,
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";


const AkrantiainExecutor = create(
  require("./akrantiain-executor.scss"), "AkrantiainExecutor",
  function ({
    defaultSource,
    open,
    onClose,
    styles
  }: {
    defaultSource?: string,
    open: boolean,
    onClose?: (event: MouseEvent<HTMLElement>, source: string) => AsyncOrSync<void>,
    styles?: StylesRecord
  }): ReactElement {

    let [source, setSource] = useState(defaultSource ?? "");
    let [input, setInput] = useState("");
    let [output, setOutput] = useState("");
    let [errorMessage, setErrorMessage] = useState("");
    let [, {trans}] = useIntl();

    let executeAkrantiain = useCallback(function (): void {
      try {
        let akrantiain = Akrantiain.load(source);
        let output = akrantiain.convert(input);
        setOutput(output);
        setErrorMessage("");
      } catch (error) {
        let errorMessage = error.message.trim() ?? "Unknown error";
        setOutput("");
        setErrorMessage(errorMessage);
      }
    }, [source, input]);

    let handleClose = useCallback(function (event: MouseEvent<HTMLElement>): void {
      onClose?.(event, source);
    }, [onClose, source]);

    useEffect(() => {
      setSource(defaultSource ?? "");
    }, [defaultSource]);

    let version = AKRANTIAIN_VERSION;
    let node = (
      <Overlay size="large" title={trans("akrantiainExecutor.title", {version})} open={open} onClose={handleClose}>
        <div styleName="root">
          <TextArea
            className={styles!["source"]}
            label={trans("akrantiainExecutor.source")}
            value={source}
            font="monospace"
            language="akrantiain"
            nowrap={true}
            fitHeight={true}
            onSet={(source) => setSource(source)}
          />
          <Input label={trans("akrantiainExecutor.input")} value={input} onSet={(input) => setInput(input)}/>
          <Button className={styles!["button"]} label={trans("akrantiainExecutor.execute")} onClick={executeAkrantiain}/>
          <Input label={trans("akrantiainExecutor.output")} value={output} readOnly={true}/>
          <TextArea
            className={styles!["error-message"]}
            label={trans("akrantiainExecutor.errorMessage")}
            value={errorMessage}
            font="monospace"
            language="plain"
            nowrap={true}
            readOnly={true}
            fitHeight={true}
          />
        </div>
      </Overlay>
    );
    return node;

  }
);


export default AkrantiainExecutor;