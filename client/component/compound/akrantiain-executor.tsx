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
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";


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

    const [source, setSource] = useState(defaultSource ?? "");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, {trans}] = useIntl();

    const executeAkrantiain = useCallback(function (): void {
      try {
        const akrantiain = Akrantiain.load(source);
        const output = akrantiain.convert(input);
        setOutput(output);
        setErrorMessage("");
      } catch (error) {
        const errorMessage = error.message.trim() ?? "Unknown error";
        setOutput("");
        setErrorMessage(errorMessage);
      }
    }, [source, input]);

    const handleClose = useCallback(function (event: MouseEvent<HTMLElement>): void {
      onClose?.(event, source);
    }, [onClose, source]);

    useEffect(() => {
      setSource(defaultSource ?? "");
    }, [defaultSource]);

    const version = AKRANTIAIN_VERSION;
    const node = (
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