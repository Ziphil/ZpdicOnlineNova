//

import cloneDeep from "lodash-es/cloneDeep";
import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import ControlGroup from "/client/component/atom/control-group";
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import Component from "/client/component/component";
import WordSearcher from "/client/component/compound/word-searcher";
import {
  style
} from "/client/component/decorator";
import {
  EditableExample,
  EnhancedDictionary,
  Example,
  LinkedWord,
  Word
} from "/client/skeleton/dictionary";
import {
  deleteAt,
  swap
} from "/client/util/misc";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./example-editor.scss"))
export default class ExampleEditor extends Component<Props, State> {

  public state: State = {
    example: undefined as any,
    wordChooserOpen: false,
    alertOpen: false
  };

  private editingWordIndex: number | null = null;

  public constructor(props: Props) {
    super(props);
    let example = cloneDeep(this.props.example) ?? EditableExample.createEmpty();
    this.state.example = example;
  }

  private async editExample(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let example = this.state.example;
    let response = await this.request("editExample" as any, {number, example});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("exampleEdited");
      if (this.props.onClose) {
        await this.props.onClose(event);
      }
      if (this.props.onEditConfirm) {
        await this.props.onEditConfirm(example, event);
      }
    }
  }

  private async removeExample(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let exampleNumber = this.state.example.number;
    if (exampleNumber !== undefined) {
      let response = await this.request("removeExample" as any, {number, exampleNumber});
      if (response.status === 200) {
        this.props.store!.addInformationPopup("exampleRemoved");
        if (this.props.onClose) {
          await this.props.onClose(event);
        }
        if (this.props.onRemoveConfirm) {
          await this.props.onRemoveConfirm(event);
        }
      }
    }
  }

  private openWordChooser(index: number): void {
    this.editingWordIndex = index;
    this.setState({wordChooserOpen: true});
  }

  private renderSentence(): ReactNode {
    let example = this.state.example;
    let node = (
      <div styleName="container">
        <Input value={example.sentence} label={this.trans("exampleEditor.sentence")} onSet={this.setExample((sentence) => example.sentence = sentence)}/>
      </div>
    );
    return node;
  }

  private renderTranslation(): ReactNode {
    let example = this.state.example;
    let node = (
      <div styleName="container">
        <Input value={example.translation} label={this.trans("exampleEditor.translation")} onSet={this.setExample((translation) => example.translation = translation)}/>
      </div>
    );
    return node;
  }

  private renderWords(): ReactNode {
    let example = this.state.example;
    let styles = this.props.styles!;
    let innerNodes = example.words.map((word, index) => {
      let nameLabel = (index === 0) ? this.trans("exampleEditor.wordName") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <ControlGroup className={StyleNameUtil.create(styles["name"], styles["word-input"])}>
              <Input value={word.name} label={nameLabel} readOnly={true}/>
              <Button label={this.trans("exampleEditor.selectWord")} onClick={() => this.openWordChooser(index)}/>
            </ControlGroup>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setExample(() => swap(example.words, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === example.words.length - 1} onClick={this.setExample(() => swap(example.words, index, 1))}/>
              <Button iconLabel="&#xF068;" onClick={this.setExample(() => deleteAt(example.words, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (example.words.length <= 0) ? this.trans("exampleEditor.wordAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconLabel="&#xF067;" onClick={() => this.openWordChooser(example.words.length)}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    let node = (
      <div styleName="container">
        {innerNodes}
        {plusNode}
      </div>
    );
    return node;
  }

  private setExample<T extends Array<unknown>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let example = outerThis.state.example;
      outerThis.setState({example});
    };
    return wrapper;
  }

  private renderEditor(): ReactNode {
    let removeButtonNode = (this.props.example !== null) && (
      <Button label={this.trans("exampleEditor.remove")} iconLabel="&#xF2ED;" style="caution" reactive={true} onClick={() => this.setState({alertOpen: true})}/>
    );
    let confirmButtonNode = (
      <Button label={this.trans("exampleEditor.confirm")} iconLabel="&#xF00C;" style="information" reactive={true} onClick={this.editExample.bind(this)}/>
    );
    let node = (
      <div>
        <div styleName="editor">
          {this.renderSentence()}
          {this.renderTranslation()}
          {this.renderWords()}
        </div>
        <div styleName="confirm-button">
          {removeButtonNode}
          {confirmButtonNode}
        </div>
      </div>
    );
    return node;
  }

  private editWord(word: Word): void {
    let example = this.state.example;
    let wordIndex = this.editingWordIndex!;
    if (example.words[wordIndex] === undefined) {
      example.words[wordIndex] = LinkedWord.createEmpty();
    }
    example.words[wordIndex].number = word.number;
    example.words[wordIndex].name = word.name;
    this.setState({example, wordChooserOpen: false});
  }

  private renderWordChooser(): ReactNode {
    let node = (
      <WordSearcher dictionary={this.props.dictionary} style="simple" showButton={true} onSubmit={this.editWord.bind(this)}/>
    );
    return node;
  }

  private renderAlert(): ReactNode {
    let node = (
      <Alert
        text={this.trans("exampleEditor.alert")}
        confirmLabel={this.trans("exampleEditor.alertConfirm")}
        open={this.state.alertOpen}
        outsideClosable={true}
        onClose={() => this.setState({alertOpen: false})}
        onConfirm={this.removeExample.bind(this)}
      />
    );
    return node;
  }

  public render(): ReactNode {
    let page = (this.state.wordChooserOpen) ? 1 : 0;
    let node = (
      <Fragment>
        <Overlay size="large" title={this.trans("exampleEditor.title")} page={page} open={this.props.open} onClose={this.props.onClose} onBack={() => this.setState({wordChooserOpen: false})}>
          {this.renderEditor()}
          {this.renderWordChooser()}
        </Overlay>
        {this.renderAlert()}
      </Fragment>
    );
    return node;
  }

}


type Props = {
  dictionary: EnhancedDictionary,
  example: Example | null,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => AsyncOrSync<void>,
  onEditConfirm?: (example: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onRemoveConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
  example: EditableExample,
  wordChooserOpen: boolean,
  alertOpen: boolean
};