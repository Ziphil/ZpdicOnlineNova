//

import {
  cloneDeep
} from "lodash-es";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
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
  route
} from "/client/component/decorator";
import {
  createStyleName
} from "/client/util/style-names";
import {
  SlimeDictionarySkeleton,
  SlimeEditWordSkeleton,
  SlimeEquivalentSkeleton,
  SlimeInformationSkeleton,
  SlimeRelationSkeleton,
  SlimeVariationSkeleton,
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";


@route @inject
@applyStyle(require("./word-editor.scss"))
export class WordEditor extends StoreComponent<Props, State> {

  private editingRelationIndex: number | null = null;

  public constructor(props: Props) {
    super(props);
    let word = cloneDeep(this.props.word) ?? SlimeEditWordSkeleton.empty();
    let equivalentStrings = word.equivalents.map((equivalent) => equivalent.names.join(", "));
    let relationChooserOpen = false;
    this.state = {word, equivalentStrings, relationChooserOpen};
  }

  private renderNameNode(): ReactNode {
    let word = this.state.word;
    let node = (
      <div styleName="container">
        <Input value={word.name} label="単語" onSet={this.setWord((name) => word.name = name)}/>
      </div>
    );
    return node;
  }

  private renderTagNode(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = word.tags.map((tag, index) => {
      let label = (index === 0) ? "タグ" : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={tag} label={label} onSet={this.setWord((tag) => word.tags[index] = tag)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => this.swap(word.tags, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.tags.length - 1} onClick={this.setWord(() => this.swap(word.tags, index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => word.tags.splice(index, 1))}/>
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

  private renderEquivalentNode(): ReactNode {
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    let styles = this.props.styles!;
    let innerNodes = word.equivalents.map((equivalent, index) => {
      let titleLabel = (index === 0) ? "分類" : undefined;
      let nameLabel = (index === 0) ? "訳語 (コンマ区切り)" : undefined;
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
    this.swap(word.equivalents, index, direction);
    this.swap(equivalentStrings, index, direction);
  }

  private deleteEquivalent(index: number): void {
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    word.equivalents.splice(index, 1);
    equivalentStrings.splice(index, 1);
  }

  private addEquivalent(): void {
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    word.equivalents.push(SlimeEquivalentSkeleton.empty());
    equivalentStrings.push("");
  }

  private renderInformationNode(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = word.informations.map((information, index) => {
      let titleLabel = (index === 0) ? "分類" : undefined;
      let textLabel = (index === 0) ? "内容" : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form information">
            <Input className={styles["title"]} value={information.title} label={titleLabel} onSet={this.setWord((title) => word.informations[index].title = title)}/>
            <TextArea className={styles["text"]} value={information.text} label={textLabel} onSet={this.setWord((text) => word.informations[index].text = text)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => this.swap(word.informations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.informations.length - 1} onClick={this.setWord(() => this.swap(word.informations, index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => word.informations.splice(index, 1))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;" onClick={this.setWord(() => word.informations.push(SlimeInformationSkeleton.empty()))}/>
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

  private renderVariationNode(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = word.variations.map((variation, index) => {
      let titleLabel = (index === 0) ? "分類" : undefined;
      let nameLabel = (index === 0) ? "変化形" : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={variation.title} label={titleLabel} onSet={this.setWord((title) => word.variations[index].title = title)}/>
            <Input className={styles["name"]} value={variation.name} label={nameLabel} onSet={this.setWord((name) => word.variations[index].name = name)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => this.swap(word.variations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.variations.length - 1} onClick={this.setWord(() => this.swap(word.variations, index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => word.variations.splice(index, 1))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;" onClick={this.setWord(() => word.variations.push(SlimeVariationSkeleton.empty()))}/>
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

  private renderRelationNode(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = word.relations.map((relation, index) => {
      let titleLabel = (index === 0) ? "分類" : undefined;
      let nameLabel = (index === 0) ? "関連語" : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={relation.title} label={titleLabel} onSet={this.setWord((title) => word.relations[index].title = title)}/>
            <ControlGroup className={createStyleName(styles["name"], styles["relation-input"])}>
              <Input value={relation.name} label={nameLabel} readOnly={true}/>
              <Button label="変更" onClick={() => this.openRelationChooser(index)}/>
            </ControlGroup>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => this.swap(word.relations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.relations.length - 1} onClick={this.setWord(() => this.swap(word.relations, index, 1))}/>
              <Button iconLabel="&#xF00D;" onClick={this.setWord(() => word.relations.splice(index, 1))}/>
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

  private openRelationChooser(index: number): void {
    this.editingRelationIndex = index;
    this.setState({relationChooserOpen: true});
  }

  private changeRelation(relationWord: SlimeWordSkeleton): void {
    let word = this.state.word;
    let relationIndex = this.editingRelationIndex!;
    if (word.relations[relationIndex] === undefined) {
      word.relations[relationIndex] = SlimeRelationSkeleton.empty();
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

  private swap<T>(array: Array<T>, index: number, direction: 1 | -1): void {
    let targetIndex = index + direction;
    if (index >= 0 && index < array.length && targetIndex >= 0 && targetIndex < array.length) {
      let temp = array[index];
      array[index] = array[targetIndex];
      array[targetIndex] = temp;
    }
  }

  private async handleConfirm(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let word = this.state.word;
    let equivalentStrings = this.state.equivalentStrings;
    equivalentStrings.forEach((equivalentString, index) => {
      word.equivalents[index].names = equivalentString.split(/\s*,\s*/);
    });
    let number = this.props.dictionary.number;
    let response = await this.requestPost("editWord", {number, word});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("wordEdited");
      if (this.props.onClose) {
        await this.props.onClose(event);
      }
      if (this.props.onConfirm) {
        await this.props.onConfirm(word, event);
      }
    }
  }

  private renderEditorNode(): ReactNode {
    let nameNode = this.renderNameNode();
    let tagNode = this.renderTagNode();
    let equivalentNode = this.renderEquivalentNode();
    let informationNode = this.renderInformationNode();
    let variationNode = this.renderVariationNode();
    let relationNode = this.renderRelationNode();
    let node = (
      <div>
        <p styleName="caution">
          単語編集は現在ベータ版の機能です。
          ページ右上の「ダウンロード」ボタンからデータを JSON 形式でダウンロードするなど、適宜バックアップを取っておくことをお勧めします。
        </p>
        <div styleName="editor">
          {nameNode}
          {tagNode}
          {equivalentNode}
          {informationNode}
          {variationNode}
          {relationNode}
        </div>
        <div styleName="confirm-button">
          <Button label="決定" iconLabel="&#xF00C;" style="information" reactive={true} onClick={this.handleConfirm.bind(this)}/>
        </div>
      </div>
    );
    return node;
  }

  private renderRelationChooserNode(): ReactNode {
    let node = (
      <WordSearcher dictionary={this.props.dictionary} style="simple" authorized={true} showButton={true} onConfirm={this.changeRelation.bind(this)}/>
    );
    return node;
  }

  public render(): ReactNode {
    let page = (this.state.relationChooserOpen) ? 1 : 0;
    let editorNode = this.renderEditorNode();
    let relationChooserNode = this.renderRelationChooserNode();
    let node = (
      <Overlay size="large" title="単語編集" page={page} open={this.props.open} onClose={this.props.onClose} onBack={() => this.setState({relationChooserOpen: false})}>
        {editorNode}
        {relationChooserNode}
      </Overlay>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton,
  word: SlimeWordSkeleton | null,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => void | Promise<void>,
  onConfirm?: (word: SlimeEditWordSkeleton, event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
  word: SlimeEditWordSkeleton,
  equivalentStrings: Array<string>,
  relationChooserOpen: boolean
};