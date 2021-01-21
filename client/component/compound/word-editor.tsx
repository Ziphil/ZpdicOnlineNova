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
import {
  Zatlin
} from "zatlin";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import ControlGroup from "/client/component/atom/control-group";
import Input from "/client/component/atom/input";
import {
  Suggest,
  SuggestionSpec
} from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import ResourceList from "/client/component/compound/resource-list";
import WordSearcher from "/client/component/compound/word-searcher";
import {
  style
} from "/client/component/decorator";
import {
  EditableWord,
  EnhancedDictionary,
  Equivalent,
  Information,
  Relation,
  Variation,
  Word
} from "/client/skeleton/dictionary";
import {
  deleteAt,
  swap
} from "/client/util/misc";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./word-editor.scss"))
export default class WordEditor extends Component<Props, State> {

  public state: State = {
    word: undefined as any,
    relationChooserOpen: false,
    resourceListOpen: false,
    alertOpen: false
  };

  private editingRelationIndex: number | null = null;

  public constructor(props: Props) {
    super(props);
    let word = cloneDeep(this.props.word) ?? EditableWord.createEmpty();
    if (this.props.defaultName) {
      word.name = this.props.defaultName;
    }
    if (this.props.defaultEquivalentName) {
      let equivalent = {title: "", names: [this.props.defaultEquivalentName]};
      word.equivalents.push(equivalent);
    }
    let equivalentStrings = word.equivalents.map((equivalent) => equivalent.names.join(", "));
    this.state.word = {...word, equivalentStrings};
  }

  private async editWord(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let word = this.state.word;
    let equivalentStrings = this.state.word.equivalentStrings;
    equivalentStrings.forEach((equivalentString, index) => {
      word.equivalents[index].names = equivalentString.split(/\s*,\s*/);
    });
    let response = await this.request("editWord", {number, word});
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

  private async discardWord(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let wordNumber = this.state.word.number;
    if (wordNumber !== undefined) {
      let response = await this.request("discardWord", {number, wordNumber});
      if (response.status === 200) {
        this.props.store!.addInformationPopup("wordDiscarded");
        if (this.props.onClose) {
          await this.props.onClose(event);
        }
        if (this.props.onDiscardConfirm) {
          await this.props.onDiscardConfirm(event);
        }
      }
    }
  }

  private openRelationChooser(index: number): void {
    this.editingRelationIndex = index;
    this.setState({relationChooserOpen: true});
  }

  private createSuggest(propertyName: string): Suggest {
    let outerThis = this;
    let number = this.props.dictionary.number;
    let suggest = async function (pattern: string): Promise<Array<SuggestionSpec>> {
      let response = await outerThis.request("suggestDictionaryTitles", {number, propertyName, pattern}, {ignoreError: true});
      if (response.status === 200 && !("error" in response.data)) {
        let titles = response.data;
        let suggestions = titles.map((title) => ({replacement: title, node: title}));
        return suggestions;
      } else {
        return [];
      }
    };
    return suggest;
  }

  private renderName(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let zatlin = this.props.dictionary.getZatlin();
    let nameLabel = this.trans("wordEditor.name");
    let pronunciationLabel = this.trans("wordEditor.pronunciation");
    let generateNode = (zatlin !== null) && (
      <div styleName="control-button">
        <Button label={this.trans("wordEditor.generate")} onClick={() => this.generateName(zatlin!)}/>
      </div>
    );
    let node = (
      <div styleName="container">
        <div styleName="inner">
          <div styleName="form">
            <Input className={styles["title"]} value={word.name} label={nameLabel} onSet={this.setWord((name) => word.name = name)}/>
          </div>
          {generateNode}
        </div>
        <div styleName="inner large">
          <div styleName="form">
            <Input className={styles["title"]} value={word.pronunciation} label={pronunciationLabel} onSet={this.setWord((pronunciation) => word.pronunciation = pronunciation || undefined)}/>
          </div>
        </div>
      </div>
    );
    return node;
  }

  private generateName(zatlin: Zatlin): void {
    let word = this.state.word;
    try {
      let name = zatlin!.generate();
      word.name = name;
      this.setState({word});
    } catch (error) {
      console.log(error);
    }
  }

  private renderTags(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let suggest = this.createSuggest("tag");
    let innerNodes = word.tags.map((tag, index) => {
      let label = (index === 0) ? this.trans("wordEditor.tag") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={tag} label={label} suggest={suggest} onSet={this.setWord((tag) => word.tags[index] = tag)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => swap(word.tags, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.tags.length - 1} onClick={this.setWord(() => swap(word.tags, index, 1))}/>
              <Button iconLabel="&#xF068;" onClick={this.setWord(() => deleteAt(word.tags, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (word.tags.length <= 0) ? this.trans("wordEditor.tagAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconLabel="&#xF067;" onClick={this.setWord(() => word.tags.push(""))}/>
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

  private renderEquivalents(): ReactNode {
    let word = this.state.word;
    let equivalentStrings = this.state.word.equivalentStrings;
    let styles = this.props.styles!;
    let suggest = this.createSuggest("equivalent");
    let innerNodes = word.equivalents.map((equivalent, index) => {
      let titleLabel = (index === 0) ? this.trans("wordEditor.equivalentTitle") : undefined;
      let nameLabel = (index === 0) ? this.trans("wordEditor.equivalentNames") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={equivalent.title} label={titleLabel} suggest={suggest} onSet={this.setWord((title) => word.equivalents[index].title = title)}/>
            <Input className={styles["name"]} value={equivalentStrings[index]} label={nameLabel} onSet={this.setWord((string) => word.equivalentStrings[index] = string)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => this.swapEquivalent(index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.equivalents.length - 1} onClick={this.setWord(() => this.swapEquivalent(index, 1))}/>
              <Button iconLabel="&#xF068;" onClick={this.setWord(() => this.deleteEquivalent(index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (word.equivalents.length <= 0) ? this.trans("wordEditor.equivalentAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconLabel="&#xF067;" onClick={this.setWord(() => this.addEquivalent())}/>
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

  private swapEquivalent(index: number, direction: 1 | -1): void {
    let word = this.state.word;
    let equivalentStrings = this.state.word.equivalentStrings;
    swap(word.equivalents, index, direction);
    swap(equivalentStrings, index, direction);
  }

  private deleteEquivalent(index: number): void {
    let word = this.state.word;
    let equivalentStrings = this.state.word.equivalentStrings;
    deleteAt(word.equivalents, index);
    deleteAt(equivalentStrings, index);
  }

  private addEquivalent(): void {
    let word = this.state.word;
    let equivalentStrings = this.state.word.equivalentStrings;
    word.equivalents.push(Equivalent.createEmpty());
    equivalentStrings.push("");
  }

  private renderInformations(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let language = (this.props.dictionary.settings.enableMarkdown) ? "markdown" as const : undefined;
    let suggest = this.createSuggest("information");
    let innerNodes = word.informations.map((information, index) => {
      let titleLabel = (index === 0) ? this.trans("wordEditor.informationTitle") : undefined;
      let textLabel = (index === 0) ? this.trans("wordEditor.informationText") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form information">
            <Input className={styles["title"]} value={information.title} label={titleLabel} suggest={suggest} onSet={this.setWord((title) => word.informations[index].title = title)}/>
            <TextArea className={styles["text"]} value={information.text} label={textLabel} font="monospace" language={language} onSet={this.setWord((text) => word.informations[index].text = text)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => swap(word.informations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.informations.length - 1} onClick={this.setWord(() => swap(word.informations, index, 1))}/>
              <Button iconLabel="&#xF068;" onClick={this.setWord(() => deleteAt(word.informations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (word.informations.length <= 0) ? this.trans("wordEditor.informationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconLabel="&#xF067;" onClick={this.setWord(() => word.informations.push(Information.createEmpty()))}/>
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

  private renderVariations(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let suggest = this.createSuggest("variation");
    let innerNodes = word.variations.map((variation, index) => {
      let titleLabel = (index === 0) ? this.trans("wordEditor.variationTitle") : undefined;
      let nameLabel = (index === 0) ? this.trans("wordEditor.variationName") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={variation.title} label={titleLabel} suggest={suggest} onSet={this.setWord((title) => word.variations[index].title = title)}/>
            <Input className={styles["name"]} value={variation.name} label={nameLabel} onSet={this.setWord((name) => word.variations[index].name = name)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => swap(word.variations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.variations.length - 1} onClick={this.setWord(() => swap(word.variations, index, 1))}/>
              <Button iconLabel="&#xF068;" onClick={this.setWord(() => deleteAt(word.variations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (word.variations.length <= 0) ? this.trans("wordEditor.variationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconLabel="&#xF067;" onClick={this.setWord(() => word.variations.push(Variation.createEmpty()))}/>
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

  private renderRelations(): ReactNode {
    let word = this.state.word;
    let styles = this.props.styles!;
    let suggest = this.createSuggest("relation");
    let innerNodes = word.relations.map((relation, index) => {
      let titleLabel = (index === 0) ? this.trans("wordEditor.relationTitle") : undefined;
      let nameLabel = (index === 0) ? this.trans("wordEditor.relationName") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles["title"]} value={relation.title} label={titleLabel} suggest={suggest} onSet={this.setWord((title) => word.relations[index].title = title)}/>
            <ControlGroup className={StyleNameUtil.create(styles["name"], styles["relation-input"])}>
              <Input value={relation.name} label={nameLabel} readOnly={true}/>
              <Button label={this.trans("wordEditor.selectRelation")} onClick={() => this.openRelationChooser(index)}/>
            </ControlGroup>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={this.setWord(() => swap(word.relations, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === word.relations.length - 1} onClick={this.setWord(() => swap(word.relations, index, 1))}/>
              <Button iconLabel="&#xF068;" onClick={this.setWord(() => deleteAt(word.relations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (word.relations.length <= 0) ? this.trans("wordEditor.relationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconLabel="&#xF067;" onClick={() => this.openRelationChooser(word.relations.length)}/>
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

  private editRelation(relationWord: Word): void {
    let word = this.state.word;
    let relationIndex = this.editingRelationIndex!;
    if (word.relations[relationIndex] === undefined) {
      word.relations[relationIndex] = Relation.createEmpty();
    }
    word.relations[relationIndex].number = relationWord.number;
    word.relations[relationIndex].name = relationWord.name;
    this.setState({word, relationChooserOpen: false});
  }

  private setWord<T extends Array<unknown>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let word = outerThis.state.word;
      outerThis.setState({word});
    };
    return wrapper;
  }

  private renderEditor(): ReactNode {
    let discardButtonNode = (this.props.word !== null) && (
      <Button label={this.trans("wordEditor.discard")} iconLabel="&#xF2ED;" style="caution" onClick={() => this.setState({alertOpen: true})}/>
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
        <div styleName="confirm-button-wrapper">
          <div styleName="confirm-button">
            <Button label={this.trans("wordEditor.resource")} iconLabel="&#xF15B;" onClick={() => this.setState({resourceListOpen: true})}/>
          </div>
          <div styleName="confirm-button">
            {discardButtonNode}
            {confirmButtonNode}
          </div>
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

  private renderResourceList(): ReactNode {
    let node = (
      <ResourceList dictionary={this.props.dictionary} size={10} showCode={true} showInstruction={true}/>
    );
    return node;
  }

  private renderAlert(): ReactNode {
    let node = (
      <Alert
        text={this.trans("wordEditor.alert")}
        confirmLabel={this.trans("wordEditor.alertConfirm")}
        open={this.state.alertOpen}
        outsideClosable={true}
        onClose={() => this.setState({alertOpen: false})}
        onConfirm={this.discardWord.bind(this)}
      />
    );
    return node;
  }

  public render(): ReactNode {
    let page = (this.state.resourceListOpen) ? 2 : (this.state.relationChooserOpen) ? 1 : 0;
    let showBack = this.state.relationChooserOpen ||this.state.resourceListOpen;
    let node = (
      <Fragment>
        <Overlay
          size="large"
          title={this.trans("wordEditor.title")}
          open={this.props.open}
          page={page}
          showBack={showBack}
          onClose={this.props.onClose}
          onBack={() => this.setState({relationChooserOpen: false, resourceListOpen: false})}
        >
          {this.renderEditor()}
          {this.renderRelationChooser()}
          {this.renderResourceList()}
        </Overlay>
        {this.renderAlert()}
      </Fragment>
    );
    return node;
  }

}


type Props = {
  dictionary: EnhancedDictionary,
  word: Word | null,
  defaultName?: string,
  defaultEquivalentName?: string,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => AsyncOrSync<void>,
  onEditConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
  word: TemporaryEditableWord,
  relationChooserOpen: boolean,
  resourceListOpen: boolean,
  alertOpen: boolean
};

export type TemporaryEditableWord = EditableWord & {equivalentStrings: Array<string>};