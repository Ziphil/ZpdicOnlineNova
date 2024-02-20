//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {ResourceList} from "/client-new/component/compound/resource-list";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";
import {useSuspenseResponse} from "/client-new/hook/request";


export const DictionaryResourcePart = create(
  require("./dictionary-resource-part.scss"), "DictionaryResourcePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryResourcePart");

    const dictionary = useDictionary();

    const number = dictionary.number;
    const [[resources]] = useSuspenseResponse("fetchResources", {number}, {keepPreviousData: true});

    console.log(resources);

    return (
      <div styleName="root" {...rest}>
        <section>
          <ResourceList dictionary={dictionary} resources={resources} pageSpec={{size: 40}}/>
        </section>
      </div>
    );

  }
);