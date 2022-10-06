//

import * as react from "react";
import {
  ChangeEvent,
  Fragment,
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
    withContainer = true,
    onChange,
    onSet,
    className,
    children
  }: {
    value: V | null,
    name: string,
    withContainer?: boolean,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    onSet?: (value: V) => void,
    className?: string,
    children?: ReactNode
  }): ReactElement {

    const ContextProvider = radioContext["Provider"];
    const contextValue = useMemo(() => ({value, name, onChange, onSet}), [value, name, onChange, onSet]);
    const node = (
      <ContextProvider value={contextValue}>
        <RadioGroupContainer {...{withContainer, className}}>
          {children}
        </RadioGroupContainer>
      </ContextProvider>
    );
    return node;

  }
);


export const RadioGroupContainer = create(
  require("./radio-group.scss"), "",
  function ({
    withContainer,
    className,
    children
  }: {
    withContainer?: boolean,
    className?: string,
    children?: ReactNode
  }): ReactElement {

    const node = (withContainer) ? (
      <div styleName="root" className={className}>
        {children}
      </div>
    ) : (
      <Fragment>
        {children}
      </Fragment>
    );
    return node;

  }
);


export default RadioGroup;