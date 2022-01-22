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
import Button from "/client/component-function/atom/button";
import Input from "/client/component-function/atom/input";
import Label from "/client/component-function/atom/label";
import Overlay from "/client/component-function/atom/overlay";
import TextArea from "/client/component-function/atom/text-area";
import {
  StylesRecord,
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import {
  RegexpExecResult,
  RegexpUtil
} from "/client/util/regexp";


const RegexpExecutor = create(
  require("./regexp-executor.scss"), "RegexpExecutor",
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
    let [target, setTarget] = useState("");
    let [result, setResult] = useState<RegexpExecResult | null>(null);
    let [errorMessage, setErrorMessage] = useState("");
    let [, {trans}] = useIntl();

    let executeRegexp = useCallback(function (): void {
      try {
        let result = RegexpUtil.exec(source, target);
        setResult(result);
        setErrorMessage("");
      } catch (error) {
        let errorMessage = error.message.trim() ?? "Unknown error";
        setResult(null);
        setErrorMessage(errorMessage);
      }
    }, [source, target]);

    let handleClose = useCallback(function (event: MouseEvent<HTMLElement>): void {
      onClose?.(event, source);
    }, [onClose, source]);

    useEffect(() => {
      setSource(defaultSource ?? "");
    }, [defaultSource]);

    let node = (
      <Overlay size="large" title={trans("regexpExecutor.title")} open={open} onClose={handleClose}>
        <div styleName="root">
          <TextArea
            className={styles!["source"]}
            label={trans("regexpExecutor.source")}
            value={source}
            font="monospace"
            language="regexp"
            nowrap={true}
            fitHeight={true}
            onSet={(source) => setSource(source)}
          />
          <TextArea
            className={styles!["target"]}
            label={trans("regexpExecutor.target")}
            value={target}
            font="monospace"
            language="plain"
            nowrap={true}
            fitHeight={true}
            onSet={(target) => setTarget(target)}
          />
          <Button className={styles!["button"]} label={trans("regexpExecutor.execute")} onClick={executeRegexp}/>
          <RegexpExecutorResult {...{result, errorMessage}}/>
        </div>
      </Overlay>
    );
    return node;

  }
);


const RegexpExecutorResult = create(
  require("./regexp-executor.scss"),
  function ({
    result,
    errorMessage
  }: {
    result: RegexpExecResult | null,
    errorMessage: string
  }): ReactElement {

    let [, {trans}] = useIntl();

    let innerNodes = [];
    if (result !== null) {
      let target = result.target;
      let length = result.matches.length;
      let currentIndex = 0;
      innerNodes.push((length > 0) ? "matched" : "not matched");
      if (result.matches.length > 0) {
        innerNodes.push((length === 1) ? ` (${length} match):\n` : ` (${length} matches):\n`);
        innerNodes.push("  ");
        for (let index = 0 ; index < result.matches.length ; index ++) {
          let range = result.matches[index].range;
          let rangeNode = (
            <span styleName="hit" key={index}>
              {target.substring(range.start, range.end).replaceAll("\n", "\n  ")}
            </span>
          );
          innerNodes.push(target.substring(currentIndex, range.start).replaceAll("\n", "\n  "));
          innerNodes.push(rangeNode);
          currentIndex = range.end;
        }
        innerNodes.push(target.substring(currentIndex, target.length).replace("\n", "\n  "));
      }
    } else {
      innerNodes.push(errorMessage);
    }
    let node = (
      <div styleName="error-message">
        <Label text={trans("regexpExecutor.result")}/>
        <div styleName="result-input">
          {innerNodes}
        </div>
      </div>
    );
    return node;

  }
);


export default RegexpExecutor;