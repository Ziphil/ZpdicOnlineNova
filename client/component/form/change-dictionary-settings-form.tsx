//

import {
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Radio from "/client/component/atom/radio";
import RadioGroup from "/client/component/atom/radio-group";
import {
  create
} from "/client/component/create";
import {
  invalidateQueries,
  usePopup,
  useRequest,
  useTrans
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
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement | null {

    const [value, setValue] = useState<any>(currentSettings[propertyName]);
    const {trans} = useTrans("changeDictionarySettingsForm");
    const {request} = useRequest();
    const {addInformationPopup} = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const settings = {[propertyName]: value};
      const response = await request("changeDictionarySettings", {number, settings});
      if (response.status === 200) {
        addInformationPopup(`dictionarySettingsChanged.${propertyName}`);
        await onSubmit?.();
        await invalidateQueries("fetchDictionary", (data) => data.number === number);
      }
    }, [number, propertyName, value, request, onSubmit, addInformationPopup]);

    if (propertyName === "punctuations") {
      return null;
    } else if (propertyName === "pronunciationTitle") {
      const node = (
        <form styleName="root input">
          <Input label={trans("pronunciationTitle")} value={value} onSet={setValue}/>
          <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
        </form>
      );
      return node;
    } else if (propertyName === "exampleTitle") {
      const node = (
        <form styleName="root input">
          <Input label={trans("exampleTitle")} value={value} onSet={setValue}/>
          <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
        </form>
      );
      return node;
    } else if (propertyName === "enableMarkdown") {
      const node = (
        <form styleName="root radio">
          <RadioGroup name="enableMarkdown" value={value} onSet={setValue}>
            <Radio value={true} label={trans("enableMarkdownTrue")}/>
            <Radio value={false} label={trans("enableMarkdownFalse")}/>
          </RadioGroup>
          <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
        </form>
      );
      return node;
    } else if (propertyName === "enableDuplicateName") {
      const node = (
        <form styleName="root radio">
          <RadioGroup name="enableDuplicateName" value={value} onSet={setValue}>
            <Radio value={true} label={trans("enableDuplicateNameTrue")}/>
            <Radio value={false} label={trans("enableDuplicateNameFalse")}/>
          </RadioGroup>
          <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
        </form>
      );
      return node;
    } else {
      return null;
    }

  }
);


export default ChangeDictionarySettingsForm;