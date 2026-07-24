//

import {ReactElement, ReactNode} from "react";
import {FieldPath, UseFormReturn} from "react-hook-form";
import {ControlErrorMessage as ZographiaControlErrorMessage} from "zographia";
import {create} from "/client/component/create";


export const ControlErrorMessage = create(
  require("./control-error-message.scss"), "ControlErrorMessage",
  function <T extends {}>({
    name,
    form,
    trans,
    children,
    ...rest
  }: {
    name: FieldPath<T>,
    form: UseFormReturn<T>,
    trans: (id: string) => string,
    children?: ReactNode,
    className?: string
  }): ReactElement | null {

    const error = form.getFieldState(name).error;

    return (error !== undefined && error.message !== undefined) ? (
      <ZographiaControlErrorMessage styleName="root" {...rest}>
        {trans(`error.${error.message}`)}
      </ZographiaControlErrorMessage>
    ) : null;

  }
);