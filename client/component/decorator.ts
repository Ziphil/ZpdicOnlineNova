//

import {
  inject,
  observer
} from "mobx-react";
import {
  ComponentClass
} from "react";
import css from "react-css-modules";
import {
  IntlShape,
  injectIntl
} from "react-intl";
import clickOutside from "react-onclickoutside";
import {
  RouteComponentProps
} from "react-router";
import {
  withRouter
} from "react-router-dom";
import {
  GlobalStore
} from "/client/component/store";


export function style(style: any, options: DecoratorOptions = {}): ClassDecorator {
  let nextOptions = Object.assign({}, DEFAULT_DECORATOR_OPTIONS, options);
  let decorator = function <P, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
    if (style !== null && style !== undefined) {
      component = css(style, {allowMultiple: true, handleNotFoundStyleName: "ignore"})(component);
    }
    if (nextOptions.clickOutside) {
      component = wrappedClickOutside(component);
    }
    if (nextOptions.observer) {
      component = wrappedObserver(component);
    }
    if (nextOptions.withRouter) {
      component = wrappedWithRouter(component);
    }
    if (nextOptions.inject) {
      component = wrappedInject(component);
    }
    if (nextOptions.injectIntl) {
      component = wrappedInjectIntl(component);
    }
    return component;
  };
  return decorator as any;
}

function wrappedClickOutside<P, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  let anyComponent = component as any;
  let resultComponent = clickOutside(anyComponent) as any;
  return resultComponent;
}

function wrappedWithRouter<P extends Partial<RouteComponentProps<any>>, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  let anyComponent = component as any;
  let resultComponent = withRouter(anyComponent) as any;
  return resultComponent;
}

function wrappedInject<P extends {store?: GlobalStore}, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  return inject("store")(component);
}

function wrappedInjectIntl<P extends {intl?: IntlShape}, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  let anyComponent = component as any;
  let resultComponent = injectIntl(anyComponent) as any;
  return resultComponent;
}

function wrappedObserver<P extends any, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  return observer(component);
}

type DecoratorOptions = {
  withRouter?: boolean,
  inject?: boolean,
  injectIntl?: boolean,
  observer?: boolean,
  clickOutside?: boolean
};
const DEFAULT_DECORATOR_OPTIONS = {
  withRouter: true,
  inject: true,
  injectIntl: true,
  observer: false,
  clickOutside: false
};