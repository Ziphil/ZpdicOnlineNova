/* eslint-disable react/jsx-closing-bracket-location */

import {faEdit, faRight} from "@fortawesome/sharp-regular-svg-icons";
import {MouseEvent, ReactElement, useCallback} from "react";
import {Button, ButtonIconbag, GeneralIcon, LinkIconbag, LoadingIcon, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";
import {useFilledExample} from "/client/hook/example";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Example} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";


export const ExamplePopoverInner = create(
  require("./example-popover-inner.scss"), "ExamplePopoverInner",
  function ({
    dictionary,
    example,
    onEdit,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    example: Example,
    onEdit?: (example: Example, event: MouseEvent<HTMLButtonElement>) => void,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("examplePopover");

    const [canEdit] = useResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});

    const filledExample = useFilledExample(dictionary, example);

    const handleEdit = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      if (filledExample !== undefined) {
        onEdit?.(filledExample, event);
      }
    }, [filledExample, onEdit]);

    return (filledExample !== undefined) ? (
      <div styleName="root" {...rest}>
        {(canEdit) && (
          <Button size="small" scheme="secondary" variant="underline" onClick={handleEdit}>
            <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
            {trans("button.edit")}
          </Button>
        )}
        <Link href={`/dictionary/${getDictionaryIdentifier(dictionary)}/sentences?kind=exact&number=${filledExample.number}`} scheme="secondary" variant="underline">
          <LinkIconbag><GeneralIcon icon={faRight}/></LinkIconbag>
          {trans("button.detail")}
        </Link>
      </div>
    ) : (
      <div styleName="root-loading">
        <LoadingIcon/>
      </div>
    );

  }
);


function isFull(example: Example | {number: number}): example is Example {
  return "sentence" in example && "translation" in example;
}