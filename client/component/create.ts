//

import {FunctionComponent, Ref, forwardRef, memo} from "react";
import cssModules from "react-css-modules";


export function create<C extends FunctionComponent<any>>(css: any, name: string, component: C, options?: FunctionComponentOptions): C {
  if (css !== null && css !== undefined) {
    component = cssModules(css.default, {allowMultiple: true, handleNotFoundStyleName: "ignore"})(component);
  }
  if (options?.memo) {
    component = memo(component) as any;
  }
  component.displayName = name ?? "<unknown>";
  return component;
}

export function createWithRef<C extends FunctionComponentWithRef<any, any>>(css: any, name: string, component: C, options?: FunctionComponentOptions): C {
  if (css !== null && css !== undefined) {
    component = cssModules(component, css.default, {allowMultiple: true, handleNotFoundStyleName: "ignore"});
  }
  let forwardedComponent = forwardRef((props, ref) => component({...props, ref}));
  if (options?.memo) {
    forwardedComponent = memo(forwardedComponent) as any;
  }
  forwardedComponent.displayName = name ?? "<unknown>";
  return forwardedComponent as any;
}

type FunctionComponentWithRef<T, P> = FunctionComponent<P & {ref: Ref<T>}>;
type FunctionComponentOptions = {memo?: boolean};