//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {ResourceList} from "/client/component/compound/resource-list";
import {create} from "/client/component/create";
import {AddResourceButton} from "/client/component/form/add-resource-button";
import {useDictionary} from "/client/hook/dictionary";
import {useSuspenseResponse} from "/client/hook/request";


export const DictionaryResourcePart = create(
  require("./dictionary-resource-part.scss"), "DictionaryResourcePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const dictionary = useDictionary();

    const number = dictionary.number;
    const [[resources]] = useSuspenseResponse("fetchResources", {number}, {keepPreviousData: true});

    return (
      <div styleName="root" {...rest}>
        <section>
          <div styleName="list-container">
            <AddResourceButton dictionary={dictionary}/>
            <ResourceList dictionary={dictionary} resources={resources} pageSpec={{size: 50}} showFooter={true}/>
          </div>
        </section>
      </div>
    );

  }
);