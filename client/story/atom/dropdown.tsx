//

import * as react from "react";
import {
  Fragment,
  useState
} from "react";
import Button from "/client/component/atom/button";
import {
  Dropdown
} from "/client/component/atom/dropdown-beta";
import DropdownItem from "/client/component/atom/dropdown-item";
import Input from "/client/component/atom/input";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Dropdown",
  component: Dropdown
};

const template = createTemplate<typeof Dropdown>((props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const node = (
    <Fragment>
      <div style={{display: "flex"}}>
        <div ref={setReferenceElement}>Reference Reference</div>
      </div>
      <Dropdown {...props} referenceElement={referenceElement}/>
    </Fragment>
  );
  return node;
});

const templateAutoModeFocus = createTemplate<typeof Dropdown>((props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [autoElement, setAutoElement] = useState<HTMLDivElement | null>(null);
  const node = (
    <Fragment>
      <div style={{display: "flex"}}>
        <Input value="" rootRef={setReferenceElement} nativeRef={setAutoElement}/>
      </div>
      <Dropdown {...props} referenceElement={referenceElement} autoElement={autoElement}/>
    </Fragment>
  );
  return node;
});

const templateAutoModeClick = createTemplate<typeof Dropdown>((props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const node = (
    <Fragment>
      <div style={{display: "flex"}}>
        <Button label="Button" nativeRef={setReferenceElement}/>
      </div>
      <Dropdown {...props} referenceElement={referenceElement} autoElement={referenceElement}/>
    </Fragment>
  );
  return node;
});

export const Basic = createStory(template, {
  args: {
    open: true,
    children: [
      <DropdownItem key="1" value="1">Item 1</DropdownItem>,
      <DropdownItem key="2" value="2">Item 2</DropdownItem>,
      <DropdownItem key="3" value="3">Item 3</DropdownItem>
    ]
  }
});

export const ShowArrow = createStory(template, {
  args: {
    open: true,
    showArrow: true,
    children: [
      <DropdownItem key="1" value="1">Item 1</DropdownItem>,
      <DropdownItem key="2" value="2">Item 2</DropdownItem>,
      <DropdownItem key="3" value="3">Item 3</DropdownItem>
    ]
  }
});

export const FillWidth = createStory(template, {
  args: {
    open: true,
    fillWidth: true,
    children: [
      <DropdownItem key="1" value="1">Item 1</DropdownItem>,
      <DropdownItem key="2" value="2">Item 2</DropdownItem>,
      <DropdownItem key="3" value="3">Item 3</DropdownItem>
    ]
  }
});

export const RestrictHeight = createStory(template, {
  args: {
    open: true,
    restrictHeight: true,
    children: [
      <DropdownItem key="1" value="1">Item 1</DropdownItem>,
      <DropdownItem key="2" value="2">Item 2</DropdownItem>,
      <DropdownItem key="3" value="3">Item 3</DropdownItem>,
      <DropdownItem key="4" value="4">Item 4</DropdownItem>,
      <DropdownItem key="5" value="5">Item 5</DropdownItem>,
      <DropdownItem key="6" value="6">Item 6</DropdownItem>,
      <DropdownItem key="7" value="7">Item 7</DropdownItem>,
      <DropdownItem key="8" value="8">Item 8</DropdownItem>,
      <DropdownItem key="9" value="9">Item 9</DropdownItem>,
      <DropdownItem key="10" value="10">Item 10</DropdownItem>
    ]
  }
});

export const AutoModeFocus = createStory(templateAutoModeFocus, {
  args: {
    autoMode: "focus",
    children: [
      <DropdownItem key="1" value="1">Item 1</DropdownItem>,
      <DropdownItem key="2" value="2">Item 2</DropdownItem>,
      <DropdownItem key="3" value="3">Item 3</DropdownItem>
    ]
  }
});

export const AutoModeClick = createStory(templateAutoModeClick, {
  args: {
    autoMode: "click",
    children: [
      <DropdownItem key="1" value="1">Item 1</DropdownItem>,
      <DropdownItem key="2" value="2">Item 2</DropdownItem>,
      <DropdownItem key="3" value="3">Item 3</DropdownItem>
    ]
  }
});