//

import {
  debounce as lodashDebounce
} from "lodash-es";
import {
  action as mobxAction,
  observable as mobxObservable
} from "mobx";
import {
  inject as mobxInject,
  observer as mobxObserver
} from "mobx-react";
import {
  ComponentClass
} from "react";
import * as css from "react-css-modules";
import {
  RouteComponentProps
} from "react-router";
import {
  withRouter
} from "react-router-dom";
import {
  GlobalStore
} from "/client/component/store";


export function applyStyle(component: any): ClassDecorator {
  let options = {allowMultiple: true, handleNotFoundStyleName: "ignore"};
  let decorator = css(component, options);
  return decorator;
}

export function debounce(duration: number): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    descriptor.value = lodashDebounce(descriptor.value, duration);
    return descriptor;
  };
  return decorator;
}

export function route<P extends Partial<RouteComponentProps<any>>, C extends ComponentClass<P>>(clazz: C & ComponentClass<P>): C & ComponentClass<P> {
  let anyClass = clazz as any;
  let resultClass = withRouter(anyClass) as any;
  return resultClass;
}

export function inject<P extends {store?: GlobalStore}, C extends ComponentClass<P>>(clazz: C & ComponentClass<P>): C & ComponentClass<P> {
  return mobxInject("store")(clazz);
}

export function observer<P extends any, C extends ComponentClass<P>>(clazz: C): C {
  return mobxObserver(clazz);
}

export let observable = mobxObservable;
export let action = mobxAction;
export let boundAction = mobxAction.bound;