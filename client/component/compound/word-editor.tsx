//

import {
  cloneDeep
} from "lodash-es";
import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  Alert,
  Button,
  ControlGroup,
  Input,
  Overlay,
  TextArea
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  WordSearcher
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  intl,
  route
} from "/client/component/decorator";
import {
  deleteAt,
  swap
} from "/client/util/misc";
import {
  StyleNameUtil
} from "/client/util/style-name";
import {
  Dictionary,
  EditWord,
  Equivalent,
  Information,
  Relation,
  Variation,
  Word
} from "/server/skeleton/dictionary";


@route @inject @intl
@applyStyle(require("./word-editor.scss"))
export class WordEditor extends StoreComponent<Props, State> {

  private editingRelationIndex: number | null = null;

  public constructor(props: Props) {
    super(props);
    let word = cloneDeep(this.props.word) ?? EditWord.empty();
    let equivalentStrings = word.equivalents.map((equivalent) => equivalent.names.join(", "));
    let relationChooserOpen = false;
    let alertOpen = false;
    this.state = {word, equivalentStrings, relationChooserOpen, alertOpen};
  }

  private async editWord(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    equivalentStrings.forEach((equivalentString, index) => {
      word.equivalents[index].names = equivalentString.split(/\s*,\s*/);
    });
    let response = await this.requestPost("editWord", {number, word});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("wordEdited");
      if (this.props.onClose) {
        await this.props.onClose(event);
      }
      if (this.props.onEditConfirm) {
        await this.props.onEditConfirm(word, event);
      }
    }
  }

  private async deleteWord(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let wordNumber = this.state.word.number;
    if (wordNumber !== undefined) {
      let response = await this.requestPost("deleteWord", {number, wordNumber});
      if (response.status === 200) {
        this.props.store!.addInformationPopup("wordDeleted");
        if (this.props.onClose) {
          await this.props.onClose(event);
        }
        if (this.props.onDeleteConfirm) {
          await this.props.onDeleteConfirm(event);
        }
      }
    }
  }

  private openRelationChooser(index: number): void {
    this.editingRelationIndex = index;
    this.setState({relationChooserOpen: true});
  }

  private renderName(): ReactNode {
    let word = this.state.word;
    let node = (
      <div styleName="container">
        <Input value={word.name} label={this.trans("wordEditor.name")} onSet={this.setWord((name) => word.name = name)}/>
      </div>
    );
    return node;
  }

  private renderTags(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = word.tags.map((tag, index) => {
      let label = (index === 0) ? this.trans("wordEditor.tag") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={tag} label={label} onSet={this.setWord((tag) => word.tags[index] = tag)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => swap(word.tags, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.tags.length - 1} onClick={this.setWord(() => swap(word.tags, index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => deleteAt(word.tags, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;" onClick={this.setWord(() => word.tags.push(""))}/>
      </div>
    );
    let node = (
      <div styleName="container">
        {innerNodes}
        {plusNode}
      </div>
    );
    return node;
  }

  private renderEquivalents(): ReactNode {
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    let styles = this.props.styles!;
    let innerNodes = word.equivalents.map((equivalent, index) => {
      let titleLabel = (index === 0) ? this.trans("wordEditor.equivalentTitle") : undefined;
      let nameLabel = (index === 0) ? this.trans("wordEditor.equivalentNames") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={equivalent.title} label={titleLabel} onSet={this.setWord((title) => word.equivalents[index].title = title)}/>
            <Input className={styles["name"]} value={equivalentStrings[index]} label={nameLabel} onSet={this.setEquivalentStrings((string) => equivalentStrings[index] = string)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => this.swapEquivalent(index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.equivalents.length - 1} onClick={this.setWord(() => this.swapEquivalent(index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => this.deleteEquivalent(index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;" onClick={this.setWord(() => this.addEquivalent())}/>
      </div>
    );
    let node = (
      <div styleName="container">
        {innerNodes}
        {plusNode}
      </div>
    );
    return node;
  }

  private swapEquivalent(index: number, direction: 1 | -1): void {
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    swap(word.equivalents, index, direction);
    swap(equivalentStrings, index, direction);
  }

  private deleteEquivalent(index: number): void {
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    deleteAt(word.equivalents, index);
    deleteAt(equivalentStrings, index);
  }

  private addEquivalent(): void {
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    word.equivalents.push(Equivalent.empty());
    equivalentStrings.push("");
  }

  private renderInformations(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = word.informations.map((information, index) => {
      let titleLabel = (index === 0) ? this.trans("wordEditor.informationTitle") : undefined;
      let textLabel = (index === 0) ? this.trans("wordEditor.informationText") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form information">
            <Input className={styles["title"]} value={information.title} label={titleLabel} onSet={this.setWord((title) => word.informations[index].title = title)}/>
            <TextArea className={styles["text"]} value={information.text} label={textLabel} onSet={this.setWord((text) => word.informations[index].text = text)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => swap(word.informations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.informations.length - 1} onClick={this.setWord(() => swap(word.informations, index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => deleteAt(word.informations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;" onClick={this.setWord(() => word.informations.push(Information.empty()))}/>
      </div>
    );
    let node = (
      <div styleName="container">
        {innerNodes}
        {plusNode}
      </div>
    );
    return node;
  }

  private renderVariations(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = word.variations.map((variation, index) => {
      let titleLabel = (index === 0) ? this.trans("wordEditor.variationTitle") : undefined;
      let nameLabel = (index === 0) ? this.trans("wordEditor.variationName") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={variation.title} label={titleLabel} onSet={this.setWord((title) => word.variations[index].title = title)}/>
            <Input className={styles["name"]} value={variation.name} label={nameLabel} onSet={this.setWord((name) => word.variations[index].name = name)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => swap(word.variations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.variations.length - 1} onClick={this.setWord(() => swap(word.variations, index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => deleteAt(word.variations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;" onClick={this.setWord(() => word.variations.push(Variation.empty()))}/>
      </div>
    );
    let node = (
      <div styleName="container">
        {innerNodes}
        {plusNode}
      </div>
    );
    return node;
  }

  private renderRelations(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = word.relations.map((relation, index) => {
      let titleLabel = (index === 0) ? this.trans("wordEditor.relationTitle") : undefined;
      let nameLabel = (index === 0) ? this.trans("wordEditor.relationName") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={relation.title} label={titleLabel} onSet={this.setWord((title) => word.relations[index].title = title)}/>
            <ControlGroup className={StyleNameUtil.create(styles["name"], styles["relation-input"])}>
              <Input value={relation.name} label={nameLabel} readOnly={true}/>
              <Button label={this.trans("wordEditor.selectRelation")} onClick={() => this.openRelationChooser(index)}/>
            </ControlGroup>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => swap(word.relations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.relations.length - 1} onClick={this.setWord(() => swap(word.relations, index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => deleteAt(word.relations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;" onClick={() => this.openRelationChooser(word.relations.length)}/>
      </div>
    );
    let node = (
      <div styleName="container">
        {innerNodes}
        {plusNode}
      </div>
    );
    return node;
  }

  private editRelation(relationWord: Word): void {
    let word = this.state.word;
    let relationIndex = this.editingRelationIndex!;
    if (word.relations[relationIndex] === undefined) {
      word.relations[relationIndex] = Relation.empty();
    }
    word.relations[relationIndex].number = relationWord.number;
    word.relations[relationIndex].name = relationWord.name;
    this.setState({word, relationChooserOpen: false});
  }

  private setWord<T extends Array<any>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let word = outerThis.state.word;
      outerThis.setState({word});
    };
    return wrapper;
  }

  private setEquivalentStrings<T extends Array<any>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let equivalentStrings = outerThis.state.equivalentStrings;
      outerThis.setState({equivalentStrings});
    };
    return wrapper;
  }

  private renderEditor(): ReactNode {
    let deleteButtonNode = (this.props.word !== null) && (
      <Button label={this.trans("wordEditor.delete")} iconLabel="&#xF2ED;" style="caution" reactive={true} onClick={() => this.setState({alertOpen: true})}/>
    );
    let confirmButtonNode = (
      <Button label={this.trans("wordEditor.confirm")} iconLabel="&#xF00C;" style="information" reactive={true} onClick={this.editWord.bind(this)}/>
    );
    let node = (
      <div>
        <div styleName="editor">
          {this.renderName()}
          {this.renderTags()}
          {this.renderEquivalents()}
          {this.renderInformations()}
          {this.renderVariations()}
          {this.renderRelations()}
        </div>
        <div styleName="confirm-button">
          {deleteButtonNode}
          {confirmButtonNode}
        </div>
      </div>
    );
    return node;
  }

  private renderRelationChooser(): ReactNode {
    let node = (
      <WordSearcher dictionary={this.props.dictionary} style="simple" showButton={true} onSubmit={this.editRelation.bind(this)}/>
    );
    return node;
  }

  private renderAlert(): ReactNode {
    let text = `
      この単語データを永久に削除します。
      削除した後にデータを戻すことはできません。
      本当によろしいですか?
    `;
    let node = (
      <Alert
        text={text}
        iconLabel="&#xF071;"
        confirmLabel="削除"
        open={this.state.alertOpen}
        outsideClosable={true}
        onClose={() => this.setState({alertOpen: false})}
        onConfirm={this.deleteWord.bind(this)}
      />
    );
    return node;
  }

  public render(): ReactNode {
    let page = (this.state.relationChooserOpen) ? 1 : 0;
    let node = (
      <Fragment>
        <Overlay size="large" title="単語編集" page={page} open={this.props.open} onClose={this.props.onClose} onBack={() => this.setState({relationChooserOpen: false})}>
          {this.renderEditor()}
          {this.renderRelationChooser()}
        </Overlay>
        {this.renderAlert()}
      </Fragment>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  word: Word | null,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => void | Promise<void>,
  onEditConfirm?: (word: EditWord, event: MouseEvent<HTMLButtonElement>) => void | Promise<void>,
  onDeleteConfirm?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
  word: EditWord,
  equivalentStrings: Array<string>,
  relationChooserOpen: boolean,
  alertOpen: boolean
};