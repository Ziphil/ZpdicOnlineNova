//

import * as react from "react";
import {
  ChangeEvent,
  ReactElement,
  ReactNode,
  createContext,
  useMemo
} from "react";
import {
  create
} from "/client/component/create";


type RadioContextValue = {
  value: any | null,
  name: string,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: any) => void
};
export const radioContext = createContext<RadioContextValue>({
  value: null,
  name: ""
});


export const RadioGroup = create(
  require("./radio-group.scss"), "RadioGroup",
  function <V>({
    value,
    name,
    onChange,
    onSet,
    children
  }: {
    value: V | null,
    name: string,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    onSet?: (value: string) => void,
    children?: ReactNode
  }): ReactElement {

    const ContextProvider = radioContext["Provider"];
    const contextValue = useMemo(() => ({value, name, onChange, onSet}), [value, name, onChange, onSet]);
    const node = (
      <ContextProvider value={contextValue}>
        {children}
      </ContextProvider>
    );
    return node;

  }
);


export default RadioGroup;