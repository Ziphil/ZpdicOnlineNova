//

import * as react from "react";
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
import Radio from "/client/component/atom/radio";
import RadioGroup from "/client/component/atom/radio-group";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useTheme
} from "/client/component/hook";


const ChangeThemeForm = create(
  require("./change-theme-form.scss"), "ChangeThemeForm",
  function ({
    onSubmit
  }: {
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [currentTheme, changeCurrentTheme] = useTheme();
    const [theme, setTheme] = useState(currentTheme);
    const [, {trans}] = useIntl();

    const handleClick = useCallback(async function (): Promise<void> {
      changeCurrentTheme(theme);
      await onSubmit?.();
    }, [theme, changeCurrentTheme, onSubmit]);

    const node = (
      <Fragment>
        <form styleName="root">
          <RadioGroup name="theme" value={theme} onSet={setTheme}>
            <Radio value="light" label={trans("changeThemeForm.light")}/>
            <Radio value="dark" label={trans("changeThemeForm.dark")}/>
          </RadioGroup>
          <Button label={trans("changeThemeForm.confirm")} reactive={true} onClick={handleClick}/>
        </form>
      </Fragment>
    );
    return node;

  }
);


export default ChangeThemeForm;