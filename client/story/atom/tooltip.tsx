//

import {
  Fragment,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  Tooltip
} from "/client/component/atom/tooltip";
import {
  createDummyText
} from "/client/util/misc";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Tooltip",
  component: Tooltip
};

const template = createTemplate<typeof Tooltip>((props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const node = (
    <Fragment>
      <div style={{display: "flex"}}>
        <div ref={setReferenceElement}>Reference Reference</div>
      </div>
      <Tooltip {...props} referenceElement={referenceElement}/>
    </Fragment>
  );
  return node;
});

const templateAutoModeFocus = createTemplate<typeof Tooltip>((props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [autoElement, setAutoElement] = useState<HTMLInputElement | null>(null);
  const node = (
    <Fragment>
      <div style={{display: "flex"}}>
        <Input value="" rootRef={setReferenceElement} nativeRef={setAutoElement}/>
      </div>
      <Tooltip {...props} referenceElement={referenceElement} autoElement={autoElement}/>
    </Fragment>
  );
  return node;
});

const templateAutoModeClick = createTemplate<typeof Tooltip>((props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const node = (
    <Fragment>
      <div style={{display: "flex"}}>
        <Button label="Button" nativeRef={setReferenceElement}/>
      </div>
      <Tooltip {...props} referenceElement={referenceElement} autoElement={referenceElement}/>
    </Fragment>
  );
  return node;
});

export const Basic = createStory(template, {
  args: {
    open: true,
    children: createDummyText(1)
  }
});

export const ShowArrow = createStory(template, {
  args: {
    open: true,
    showArrow: true,
    children: createDummyText(1)
  }
});

export const FillWidth = createStory(template, {
  args: {
    open: true,
    fillWidth: true,
    children: createDummyText(1)
  }
});

export const AutoModeFocus = createStory(templateAutoModeFocus, {
  args: {
    autoMode: "focus",
    children: createDummyText(1)
  }
});

export const AutoModeClick = createStory(templateAutoModeClick, {
  args: {
    autoMode: "click",
    children: createDummyText(1)
  }
});