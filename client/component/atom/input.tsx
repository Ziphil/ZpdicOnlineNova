//

import * as react from "react";
import {
  ChangeEvent,
  FocusEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Dropdown from "/client/component/atom/dropdown";
import {
  DropdownSpec
} from "/client/component/atom/dropdown";
import Label from "/client/component/atom/label";
import Tooltip from "/client/component/atom/tooltip";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  debounce
} from "/client/util/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./input.scss"))
export default class Input extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    value: "",
    type: "text",
    useTooltip: true,
    readOnly: false,
    disabled: false
  };
  public state: State = {
    type: undefined as any,
    errorMessage: null,
    dropdownSpecs: []
  };

  public constructor(props: any) {
    super(props);
    let type = this.props.type;
    if (type === "flexible") {
      type = "password";
    }
    this.state.type = type;
  }

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value;
    this.updateValue(value);
    this.updateSuggestions(value);
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  private handleFocus(event: FocusEvent<HTMLInputElement>): void {
    let value = event.target.value;
    this.updateSuggestions(value);
  }

  private updateValue(value: string): void {
    let validate = this.props.validate;
    if (validate !== undefined) {
      let errorMessage = validate(value);
      this.setState({errorMessage});
    } else {
      this.setState({errorMessage: null});
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  @debounce(500)
  private async updateSuggestions(value: string): Promise<void> {
    let suggest = this.props.suggest;
    if (suggest !== undefined) {
      let suggestionSpecs = await suggest(value);
      let dropdownSpecs = suggestionSpecs.map((suggestionSpec) => ({value: suggestionSpec.replacement, node: suggestionSpec.node}));
      this.setState({dropdownSpecs});
    }
  }

  private toggleType(): void {
    if (this.state.type === "text") {
      this.setState({type: "password"});
    } else {
      this.setState({type: "text"});
    }
  }

  private renderInput(): ReactNode {
    let styleName = StyleNameUtil.create(
      "input",
      {if: this.state.errorMessage !== null, true: "error"},
      {if: this.props.disabled, true: "disabled"}
    );
    let eyeStyleName = StyleNameUtil.create("eye", this.state.type);
    let eyeNode = (this.props.type === "flexible") && (
      <span styleName={eyeStyleName} onClick={this.toggleType.bind(this)}/>
    );
    let prefixNode = (this.props.prefix !== undefined) && (
      <div styleName="prefix">{this.props.prefix}</div>
    );
    let suffixNode = (this.props.suffix !== undefined || this.props.type === "flexible") && (
      <div styleName="suffix">
        {this.props.suffix}
        {eyeNode}
      </div>
    );
    let node = (
      <div styleName={styleName}>
        {prefixNode}
        <input
          styleName="input-inner"
          type={this.state.type}
          value={this.props.value}
          readOnly={this.props.readOnly}
          disabled={this.props.disabled}
          onChange={this.handleChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
        />
        {suffixNode}
      </div>
    );
    return node;
  }

  private renderLabel(): ReactNode {
    let node = (
      <Label
        text={this.props.label}
        style={(this.state.errorMessage === null) ? "normal" : "error"}
        showRequired={this.props.showRequired}
        showOptional={this.props.showOptional}
      />
    );
    return node;
  }

  public render(): ReactNode {
    let inputNode = this.renderInput();
    let labelNode = this.renderLabel();
    let node = (
      <div styleName="root" className={this.props.className}>
        <Tooltip message={this.state.errorMessage}>
          <Dropdown specs={this.state.dropdownSpecs} onSet={this.updateValue.bind(this)}>
            <label styleName="label-wrapper">
              {labelNode}
              {inputNode}
            </label>
          </Dropdown>
        </Tooltip>
      </div>
    );
    return node;
  }

}


type Props = {
  value: string,
  label?: string,
  prefix?: ReactNode,
  suffix?: ReactNode,
  type: "text" | "password" | "flexible",
  validate?: (value: string) => string | null,
  suggest?: Suggest,
  showRequired?: boolean,
  showOptional?: boolean,
  useTooltip: boolean,
  readOnly: boolean,
  disabled: boolean,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: string) => void,
  className?: string
};
type DefaultProps = {
  value: string,
  type: "text" | "password" | "flexible",
  useTooltip: boolean,
  readOnly: boolean,
  disabled: boolean
};
type State = {
  type: "text" | "password",
  errorMessage: string | null,
  dropdownSpecs: Array<DropdownSpec<string>>
};

export type SuggestionSpec = {replacement: string, node: ReactNode};
export type Suggest = (pattern: string) => AsyncOrSync<Array<SuggestionSpec>>;