//

import {
  AKRANTIAIN_VERSION,
  Akrantiain
} from "akrantiain";
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
  useTrans
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

    const {trans} = useTrans("akrantiainExecutor");

    const [source, setSource] = useState(defaultSource ?? "");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
      <Overlay size="large" title={trans("title", {version})} open={open} onClose={handleClose}>
        <div styleName="root">
          <TextArea
            className={styles!["source"]}
            label={trans("source")}
            value={source}
            font="monospace"
            language="akrantiain"
            nowrap={true}
            fitHeight={true}
            onSet={setSource}
          />
          <Input label={trans("input")} value={input} onSet={setInput}/>
          <Button className={styles!["button"]} label={trans("execute")} onClick={executeAkrantiain}/>
          <Input label={trans("output")} value={output} readOnly={true}/>
          <TextArea
            className={styles!["error-message"]}
            label={trans("errorMessage")}
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