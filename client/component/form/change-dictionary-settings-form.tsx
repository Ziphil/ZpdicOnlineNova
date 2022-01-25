//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import RadioGroup from "/client/component/atom/radio-group";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  DictionarySettings
} from "/client/skeleton/dictionary";


const ChangeDictionarySettingsForm = create(
  require("./change-dictionary-settings-form.scss"), "ChangeDictionarySettingsForm",
  function <N extends keyof DictionarySettings>({
    number,
    currentSettings,
    propertyName,
    onSubmit
  }: {
    number: number,
    currentSettings: DictionarySettings,
    propertyName: N,
    onSubmit?: () => void
  }): ReactElement | null {

    let [value, setValue] = useState<any>(currentSettings[propertyName]);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let settings = {[propertyName]: value};
      let response = await request("changeDictionarySettings", {number, settings});
      if (response.status === 200) {
        addInformationPopup(`dictionarySettingsChanged.${propertyName}`);
        onSubmit?.();
      }
    }, [number, propertyName, value, request, onSubmit, addInformationPopup]);

    if (propertyName === "punctuations") {
      return null;
    } else if (propertyName === "pronunciationTitle") {
      let node = (
        <form styleName="root input">
          <Input label={trans("changeDictionarySettingsForm.pronunciationTitle")} value={value} onSet={(value) => setValue(value)}/>
          <Button label={trans("changeDictionarySettingsForm.confirm")} reactive={true} onClick={handleClick}/>
        </form>
      );
      return node;
    } else if (propertyName === "exampleTitle") {
      let node = (
        <form styleName="root input">
          <Input label={trans("changeDictionarySettingsForm.exampleTitle")} value={value} onSet={(value) => setValue(value)}/>
          <Button label={trans("changeDictionarySettingsForm.confirm")} reactive={true} onClick={handleClick}/>
        </form>
      );
      return node;
    } else if (propertyName === "enableMarkdown") {
      let specs = [
        {value: "true", label: trans("changeDictionarySettingsForm.enableMarkdownTrue")},
        {value: "false", label: trans("changeDictionarySettingsForm.enableMarkdownFalse")}
      ];
      let secretValue = (value) ? "true" : "false";
      let node = (
        <form styleName="root radio">
          <RadioGroup name="enableMarkdown" specs={specs} value={secretValue} onSet={(valueString) => setValue(valueString === "true")}/>
          <Button label={trans("changeDictionarySettingsForm.confirm")} reactive={true} onClick={handleClick}/>
        </form>
      );
      return node;
    } else {
      return null;
    }

  }
);


export default ChangeDictionarySettingsForm;