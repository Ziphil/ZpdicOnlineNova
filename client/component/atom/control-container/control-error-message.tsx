/* eslint-disable no-useless-computed-key */

import {ReactElement, ReactNode} from "react";
import {FieldPath, UseFormReturn} from "react-hook-form";
import {Path} from "react-router-dom";
import {ControlErrorMessage as ZographiaControlErrorMessage} from "zographia";
import {create} from "/client/component/create";


export const ControlErrorMessage = create(
  require("./control-error-message.scss"), "ControllErrorMessage",
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


function getRouterLinkProps(href: string | Partial<Path>, useTransition: boolean): any {
  const props = {
    to: href,
    ["unstable_viewTransition"]: useTransition
  };
  return props;
};