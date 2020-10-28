//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import ReactMarkdown from "react-markdown";
import Link from "/client/component/atom/link";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./markdown.scss"))
export default class Markdown extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    simple: false
  };

  public render(): ReactNode {
    let node = (() => {
      if (this.props.simple) {
        let simpleRenderer = function (props: any): ReactElement {
          return props.children;
        };
        let node = (
          <ReactMarkdown
            className={this.props.className}
            source={this.props.source}
            renderers={{paragraph: simpleRenderer, link: Link}}
            allowedTypes={["root", "text", "paragraph", "link"]}
          />
        );
        return node;
      } else {
        let node = (
          <div styleName="root" className={this.props.className}>
            <ReactMarkdown
              source={this.props.source}
              renderers={{link: Link}}
              disallowedTypes={["thematicBreak", "image", "imageReference", "definition", "heading", "html", "virtualHtml"]}
            />
          </div>
        );
        return node;
      }
    })();
    return node;
  }

}


type Props = {
  source: string,
  simple: boolean
  className?: string
};
type DefaultProps = {
  simple: boolean
};
type State = {
};