//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import {
  create
} from "/client/component/create";
import {
  usePath
} from "/client/component/hook";


export const WhitePane = create(
  require("./white-pane.scss"), "WhitePane",
  function ({
    clickable,
    href,
    onClick,
    children
  }: {
    clickable: boolean,
    href?: string,
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void,
    children?: ReactNode
  }): ReactElement {

    const {pushPath} = usePath();

    const handleClickAnchor = useCallback(function (event: MouseEvent<HTMLAnchorElement>): void {
      event.preventDefault();
      const path = event.currentTarget.attributes.getNamedItem("href")!.value;
      pushPath(path);
      onClick?.(event);
    }, [onClick, pushPath]);

    const innerNode = (() => {
      if (Array.isArray(children)) {
        const actualChildren = children.filter((child) => child !== null && child !== undefined && child !== false);
        if (actualChildren.length >= 2) {
          const innerNode = (
            <Fragment>
              {actualChildren[0]}
              <hr styleName="separator"/>
              {actualChildren[1]}
            </Fragment>
          );
          return innerNode;
        } else {
          return actualChildren[0];
        }
      } else {
        return children;
      }
    })();
    const node = (() => {
      if (clickable) {
        const node = (
          <a styleName="root hoverable" href={href} onClick={handleClickAnchor}>
            {innerNode}
          </a>
        );
        return node;
      } else {
        const node = (
          <div styleName="root">
            {innerNode}
          </div>
        );
        return node;
      }
    })();
    return node;

  }
);


export default WhitePane;