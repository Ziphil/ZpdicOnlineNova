//

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
  Component
} from "/client/component/component";
import {
  WordSearcher
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  createStyleName
} from "/client/util/style-names";
import {
  SlimeDictionarySkeleton,
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";


@applyStyle(require("./word-editor.scss"))
export class WordEditor extends Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    let word = Object.assign({}, this.props.word);
    let relationChooserOpen = false;
    this.state = {word, relationChooserOpen};
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
    let innerNodes = this.state.word.tags.map((tag, index) => {
      let label = (index === 0) ? "タグ" : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <Input className={styles["title"]} value={tag} label={label} onSet={this.setWord((tag) => word.tags[index] = tag)}/>
          <ControlGroup>
            <Button iconLabel="&#xF062;"/>
            <Button iconLabel="&#xF063;"/>
          </ControlGroup>
          <Button iconLabel="&#xF00D;"/>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;"/>
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
    let styles = this.props.styles!;
    let innerNodes = this.state.word.equivalents.map((equivalent, index) => {
      let titleLabel = (index === 0) ? "分類" : undefined;
      let nameLabel = (index === 0) ? "訳語 (コンマ区切り)" : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <Input className={styles["title"]} value={equivalent.title} label={titleLabel} onSet={this.setWord((title) => word.equivalents[index].title = name)}/>
          <Input className={styles["name"]} value={equivalent.names.join(", ")} label={nameLabel} onSet={this.setWord((nameString) => word.equivalents[index].names = nameString.split(/\s*,\s*/))}/>
          <ControlGroup>
            <Button iconLabel="&#xF062;"/>
            <Button iconLabel="&#xF063;"/>
          </ControlGroup>
          <Button iconLabel="&#xF00D;"/>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;"/>
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

  private renderInformationNode(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let innerNodes = this.state.word.informations.map((information, index) => {
      let titleLabel = (index === 0) ? "分類" : undefined;
      let textLabel = (index === 0) ? "内容" : undefined;
      let innerNode = (
        <div styleName="inner information" key={index}>
          <Input className={styles["title"]} value={information.title} label={titleLabel} onSet={this.setWord((title) => word.informations[index].title = title)}/>
          <TextArea className={styles["text"]} value={information.text} label={textLabel} onSet={this.setWord((text) => word.informations[index].text = text)}/>
          <ControlGroup>
            <Button iconLabel="&#xF062;"/>
            <Button iconLabel="&#xF063;"/>
          </ControlGroup>
          <Button iconLabel="&#xF00D;"/>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;"/>
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
    let innerNodes = this.state.word.variations.map((variation, index) => {
      let titleLabel = (index === 0) ? "分類" : undefined;
      let nameLabel = (index === 0) ? "変化形" : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <Input className={styles["title"]} value={variation.title} label={titleLabel} onSet={this.setWord((title) => word.variations[index].title = title)}/>
          <Input className={styles["name"]} value={variation.name} label={nameLabel} onSet={this.setWord((name) => word.variations[index].name = name)}/>
          <ControlGroup>
            <Button iconLabel="&#xF062;"/>
            <Button iconLabel="&#xF063;"/>
          </ControlGroup>
          <Button iconLabel="&#xF00D;"/>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;"/>
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
    let innerNodes = this.state.word.relations.map((relation, index) => {
      let titleLabel = (index === 0) ? "分類" : undefined;
      let nameLabel = (index === 0) ? "関連語" : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <Input className={styles["title"]} value={relation.title} label={titleLabel} onSet={this.setWord((title) => word.relations[index].title = title)}/>
          <ControlGroup className={createStyleName(styles["name"], styles["relation-input"])}>
            <Input value={relation.name} label={nameLabel} readOnly={true}/>
            <Button label="変更" onClick={() => this.setState({relationChooserOpen: true})}/>
          </ControlGroup>
          <ControlGroup>
            <Button iconLabel="&#xF062;"/>
            <Button iconLabel="&#xF063;"/>
          </ControlGroup>
          <Button iconLabel="&#xF00D;"/>
        </div>
      );
      return innerNode;
    });
    let plusNode = (
      <div styleName="plus">
        <Button iconLabel="&#xF067;"/>
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

  private setWord<V>(setter: (value: V) => void): (value: V) => void {
    let outerThis = this;
    let wrapper = function (value: V): void {
      setter(value);
      outerThis.setState({word: outerThis.state.word});
    };
    return wrapper;
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
        {nameNode}
        {tagNode}
        {equivalentNode}
        {informationNode}
        {variationNode}
        {relationNode}
      </div>
    );
    return node;
  }

  private renderRelationChooserNode(): ReactNode {
    let node = (
      <WordSearcher dictionary={this.props.dictionary} authorized={this.props.authorized}/>
    );
    return node;
  }

  public render(): ReactNode {
    let page = (this.state.relationChooserOpen) ? 1 : 0;
    let editorNode = this.renderEditorNode();
    let relationChooserNode = this.renderRelationChooserNode();
    let node = (
      <Overlay size="large" title="単語編集" page={page} open={this.props.open} outsideClosable={false} onClose={this.props.onClose} onBack={() => this.setState({relationChooserOpen: false})}>
        {editorNode}
        {relationChooserNode}
      </Overlay>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton,
  word: SlimeWordSkeleton,
  authorized: boolean,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => void
};
type State = {
  word: SlimeWordSkeleton,
  relationChooserOpen: boolean
};