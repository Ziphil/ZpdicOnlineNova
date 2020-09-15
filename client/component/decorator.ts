//

import lodashDebounce from "lodash-es/debounce";
import {
  action as originalAction,
  observable as originalObservable
} from "mobx";
import {
  inject as originalInject,
  observer as originalObserver
} from "mobx-react";
import {
  ComponentClass
} from "react";
import css from "react-css-modules";
import {
  IntlShape,
  injectIntl as originalInjectIntl
} from "react-intl";
import {
  RouteComponentProps
} from "react-router";
import {
  withRouter as originalWithRouter
} from "react-router-dom";
import {
  GlobalStore
} from "/client/component/store";


export function applyStyle(style: any, options: DecoratorOptions = {}): ClassDecorator {
  let nextOptions = Object.assign({}, DEFAULT_DECORATOR_OPTIONS, options);
  let decorator = function <P, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
    if (style !== null && style !== undefined) {
      component = css(style, {allowMultiple: true, handleNotFoundStyleName: "ignore"})(component);
    }
    if (nextOptions.withRouter) {
      component = withRouter(component);
    }
    if (nextOptions.observer) {
      component = observer(component);
    }
    if (nextOptions.inject) {
      component = inject(component);
    }
    if (nextOptions.injectIntl) {
      component = injectIntl(component);
    }
    return component;
  };
  return decorator as any;
}

export function withRouter<P extends Partial<RouteComponentProps<any>>, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  let anyComponent = component as any;
  let resultComponent = originalWithRouter(anyComponent) as any;
  return resultComponent;
}

export function inject<P extends {store?: GlobalStore}, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  return originalInject("store")(component);
}

export function injectIntl<P extends {intl?: IntlShape}, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  let anyComponent = component as any;
  let resultComponent = originalInjectIntl(anyComponent) as any;
  return resultComponent;
}

export function observer<P extends any, C extends ComponentClass<P>>(component: ComponentClass<P> & C): ComponentClass<P> & C {
  return originalObserver(component);
}

export function debounce(duration: number): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    descriptor.value = lodashDebounce(descriptor.value, duration);
    return descriptor;
  };
  return decorator;
}

export let observable = originalObservable;
export let action = originalAction;
export let boundAction = originalAction.bound;

type DecoratorOptions = {
  withRouter?: boolean,
  inject?: boolean,
  injectIntl?: boolean,
  observer?: boolean
};

const DEFAULT_DECORATOR_OPTIONS = {
  withRouter: true,
  inject: true,
  injectIntl: true,
  observer: false
};