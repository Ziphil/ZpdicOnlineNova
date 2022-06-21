//

import * as react from "react";
import {
  Loading
} from "/client/component/compound/loading";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Compound/Loading",
  component: Loading
};

const template = createTemplate<typeof Loading>((props) => <Loading {...props}/>);

export const Basic = createStory(template);