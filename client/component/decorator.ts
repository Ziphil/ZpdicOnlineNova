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
  IntlShape,
  injectIntl as reactInjectIntl
} from "react-intl";
import {
  RouteComponentProps
} from "react-router";
import {
  withRouter
} from "react-router-dom";
import {
  GlobalStore
} from "/client/component/store";


export function applyStyle(style: any): ClassDecorator {
  let options = {allowMultiple: true, handleNotFoundStyleName: "ignore"};
  let decorator = css(style, options);
  return decorator;
}

export function debounce(duration: number): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    descriptor.value = lodashDebounce(descriptor.value, duration);
    return descriptor;
  };
  return decorator;
}

export function route<P extends Partial<RouteComponentProps<any>>, C extends ComponentClass<P>>(component: C & ComponentClass<P>): C & ComponentClass<P> {
  let anyComponent = component as any;
  let resultComponent = withRouter(anyComponent) as any;
  return resultComponent;
}

export function inject<P extends {store?: GlobalStore}, C extends ComponentClass<P>>(component: C & ComponentClass<P>): C & ComponentClass<P> {
  return mobxInject("store")(component);
}

export function intl<P extends {intl?: IntlShape}, C extends ComponentClass<P>>(component: C & ComponentClass<P>): C & ComponentClass<P> {
  let anyComponent = component as any;
  let resultComponent = reactInjectIntl(anyComponent) as any;
  return resultComponent;
}

export function observer<P extends any, C extends ComponentClass<P>>(component: C & ComponentClass<P>): C & ComponentClass<P> {
  return mobxObserver(component);
}

export let observable = mobxObservable;
export let action = mobxAction;
export let boundAction = mobxAction.bound;