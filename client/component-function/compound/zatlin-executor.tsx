//

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
import {
  ZATLIN_VERSION,
  Zatlin
} from "zatlin";
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


const ZatlinExecutor = create(
  require("./zatlin-executor.scss"), "ZatlinExecutor",
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
    let [output, setOutput] = useState("");
    let [errorMessage, setErrorMessage] = useState("");
    let [, {trans}] = useIntl();

    let executeZatlin = useCallback(function (): void {
      try {
        let zatlin = Zatlin.load(source);
        let output = zatlin.generate();
        setOutput(output);
        setErrorMessage("");
      } catch (error) {
        let errorMessage = error.message.trim() ?? "Unknown error";
        setOutput("");
        setErrorMessage(errorMessage);
      }
    }, [source]);

    let handleClose = useCallback(function (event: MouseEvent<HTMLElement>): void {
      onClose?.(event, source);
    }, [onClose, source]);

    useEffect(() => {
      setSource(defaultSource ?? "");
    }, [defaultSource]);

    let version = ZATLIN_VERSION;
    let node = (
      <Overlay size="large" title={trans("zatlinExecutor.title", {version})} open={open} onClose={handleClose}>
        <div styleName="root">
          <TextArea
            className={styles!["source"]}
            label={trans("zatlinExecutor.source")}
            value={source}
            font="monospace"
            language="zatlin"
            nowrap={true}
            fitHeight={true}
            onSet={(source) => setSource(source)}
          />
          <Button className={styles!["button"]} label={trans("zatlinExecutor.execute")} onClick={executeZatlin}/>
          <Input label={trans("zatlinExecutor.output")} value={output} readOnly={true}/>
          <TextArea
            className={styles!["error-message"]}
            label={trans("zatlinExecutor.errorMessage")}
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


export default ZatlinExecutor;