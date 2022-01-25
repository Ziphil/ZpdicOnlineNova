//

import * as react from "react";
import {
  ElementType,
  ReactElement,
  ReactNode
} from "react";
import ReactMarkdown from "react-markdown";
import {
  NodeType
} from "react-markdown";
import Link from "/client/component/atom/link";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./markdown.scss"))
export default class Markdown extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    simple: false,
    allowHeading: false
  };

  public constructor(props: Props) {
    super(props);
    this.transformUri = this.transformUri.bind(this);
  }

  private getAllowedTypes(): [Array<NodeType>?, Array<NodeType>?] {
    if (this.props.simple) {
      let allowedTypes = ["root", "text", "paragraph", "link"] as Array<NodeType>;
      return [allowedTypes, undefined];
    } else {
      let disallowedTypes = ["thematicBreak", "definition", "heading", "html", "virtualHtml"] as Array<NodeType>;
      if (this.props.allowHeading) {
        disallowedTypes = disallowedTypes.filter((type) => type !== "heading");
      }
      return [undefined, disallowedTypes];
    }
  }

  private getCustomRenderers(): Renderers {
    if (this.props.simple) {
      let simpleRenderer = function (props: any): ReactElement {
        return props.children;
      };
      return {link: Link, root: simpleRenderer, paragraph: simpleRenderer};
    } else {
      return {link: Link};
    }
  }

  private transformUri(uri: string, children?: ReactNode, title?: string): string {
    let nextUri = ReactMarkdown.uriTransformer(uri);
    if (this.props.homePath !== undefined) {
      nextUri = nextUri.replace(/^~/, this.props.homePath);
    }
    return nextUri;
  }

  public render(): ReactNode {
    let [allowedTypes, disallowedTypes] = this.getAllowedTypes();
    let customRenderers = this.getCustomRenderers();
    let renderers = {...customRenderers, ...this.props.renderers};
    let innerNode = (
      <ReactMarkdown
        className={this.props.className}
        source={this.props.source}
        renderers={renderers}
        allowedTypes={allowedTypes}
        disallowedTypes={disallowedTypes}
        transformLinkUri={this.transformUri}
        transformImageUri={this.transformUri}
      />
    );
    let node = (this.props.simple) ? innerNode : <div styleName="root" className={this.props.className}>{innerNode}</div>;
    return node;
  }

}


type Props = {
  source: string,
  simple: boolean,
  allowHeading: boolean,
  homePath?: string,
  renderers?: Renderers,
  className?: string
};
type DefaultProps = {
  simple: boolean,
  allowHeading: boolean
};
type State = {
};

export type Renderers = {[type: string]: ElementType};