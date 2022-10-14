//

import * as react from "react";
import {
  useState
} from "react";
import {
  FileInput
} from "/client/component/atom/file-input";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/FileInput",
  component: FileInput
};

const template = createTemplate<typeof FileInput>((props) => {
  const [file, setFile] = useState(props.file);
  const node = (
    <FileInput {...props} file={file} onSet={(value) => (props.onSet?.(value), setFile(value))}/>
  );
  return node;
});

export const Normal = createStory(template, {
  args: {
  }
});

export const WithLabel = createStory(template, {
  args: {
    inputLabel: "Label"
  }
});