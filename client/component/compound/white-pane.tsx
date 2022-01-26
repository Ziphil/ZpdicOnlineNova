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


const WhitePane = create(
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

    let {pushPath} = usePath();

    let handleClickAnchor = useCallback(function (event: MouseEvent<HTMLAnchorElement>): void {
      event.preventDefault();
      let path = event.currentTarget.attributes.getNamedItem("href")!.value;
      pushPath(path);
      onClick?.(event);
    }, [onClick, pushPath]);

    let innerNode = (() => {
      if (Array.isArray(children)) {
        let actualChildren = children.filter((child) => child !== null && child !== undefined && child !== false);
        if (actualChildren.length >= 2) {
          let innerNode = (
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
    let node = (() => {
      if (clickable) {
        let node = (
          <a styleName="root hoverable" href={href} onClick={handleClickAnchor}>
            {innerNode}
          </a>
        );
        return node;
      } else {
        let node = (
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