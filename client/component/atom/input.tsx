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
import Label from "/client/component/atom/label";
import Suggestion from "/client/component/atom/suggestion";
import {
  SuggestionSpec
} from "/client/component/atom/suggestion";
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
    suggestionSpecs: []
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
      let suggestions = await suggest(value);
      this.setState({suggestionSpecs: suggestions});
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
      {if: this.state.errorMessage !== null, true: "error"}
    );
    let prefixNode = (this.props.prefix !== undefined) && (
      <div styleName="prefix">{this.props.prefix}</div>
    );
    let suffixNode = (this.props.suffix !== undefined) && (
      <div styleName="suffix">{this.props.suffix}</div>
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

  private renderTooltip(): ReactNode {
    let node = (
      <div styleName="tooltip">
        <p styleName="tooltip-text">
          {this.state.errorMessage}
        </p>
      </div>
    );
    return node;
  }

  public render(): ReactNode {
    let eyeNode = (this.props.type === "flexible") && (() => {
      let buttonStyleName = StyleNameUtil.create("eye", this.state.type);
      let eyeNode = <span styleName={buttonStyleName} onClick={this.toggleType.bind(this)}/>;
      return eyeNode;
    })();
    let inputNode = this.renderInput();
    let labelNode = this.renderLabel();
    let tooltipNode = (this.state.errorMessage !== null) && this.renderTooltip();
    let node = (
      <div styleName="root" className={this.props.className}>
        <Suggestion specs={this.state.suggestionSpecs} onSet={this.updateValue.bind(this)}>
          <label styleName="label-wrapper">
            {labelNode}
            {inputNode}
            {eyeNode}
          </label>
          {tooltipNode}
        </Suggestion>
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
  suggestionSpecs: Array<SuggestionSpec>
};

export type Suggest = (pattern: string) => AsyncOrSync<Array<SuggestionSpec>>;