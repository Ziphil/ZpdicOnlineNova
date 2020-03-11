//

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


export function applyStyle(component: any): ClassDecorator {
  let options = {allowMultiple: true, handleNotFoundStyleName: "ignore"};
  let decorator = css(component, options);
  return decorator;
}

export function route<P extends Partial<RouteComponentProps<any>>, T extends ComponentClass<P>>(clazz: T): T {
  let anyClass = clazz as any;
  let resultClass = withRouter(anyClass) as any;
  return resultClass;
}

export function inject<P, T extends ComponentClass<P>>(clazz: T): T {
  return mobxInject("store")(clazz);
}

export function observer<P, T extends ComponentClass<P>>(clazz: T): T {
  return mobxObserver(clazz);
}

export let observable = mobxObservable;
export let action = mobxAction;
export let boundAction = mobxAction.bound;