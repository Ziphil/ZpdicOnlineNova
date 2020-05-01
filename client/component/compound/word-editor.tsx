//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Overlay
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";
import {
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";


@applyStyle(require("./word-editor.scss"))
export class WordEditor extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Overlay open={this.props.open} onClose={this.props.onClose}>
        Editing: {this.props.word.name} (#{this.props.word.number})
      </Overlay>
    );
    return node;
  }

}


type Props = {
  word: SlimeWordSkeleton,
  authorized: boolean,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLDivElement>) => void
};
type State = {
};