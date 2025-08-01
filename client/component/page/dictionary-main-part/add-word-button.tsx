/* eslint-disable react/jsx-closing-bracket-location */

import {faAngleDown} from "@fortawesome/sharp-regular-svg-icons";
import {MouseEvent, ReactElement, useCallback, useRef} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlGroup, GeneralIcon, IconButton, Menu, MenuItem, useTrans} from "zographia";
import {fakNoteCirclePlus} from "/client/component/atom/icon";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {EditWordInitialData} from "/client/component/compound/edit-word-form";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, TemplateWord} from "/server/internal/skeleton";


export const AddWordButton = create(
  require("./add-word-button.scss"), "AddWordButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryMainPart");

    const triggerRef = useRef<(initialData: EditWordInitialData | null, event: MouseEvent<HTMLButtonElement>) => void>(null);

    const handleAddFromTemplate = useCallback(function (word: TemplateWord, event: MouseEvent<HTMLButtonElement>): void {
      triggerRef.current?.({type: "templateWord", word}, event);
    }, []);

    const handleAdd = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      triggerRef.current?.(null, event);
    }, []);

    return (
      <>
        <ControlGroup {...rest}>
          <Button variant="light" onClick={handleAdd}>
            <ButtonIconbag><GeneralIcon icon={fakNoteCirclePlus}/></ButtonIconbag>
            {trans("button.addWord")}
          </Button>
          {(dictionary.settings.templateWords.length > 0) && (
            <Menu placement="bottom-end" trigger={(
              <IconButton variant="light" label={trans("button.addWordFromTemplate")}>
                <GeneralIcon icon={faAngleDown}/>
              </IconButton>
            )}>
              {dictionary.settings.templateWords.map((word) => (
                <MenuItem key={word.id} onClick={(event) => handleAddFromTemplate(word, event)}>
                  {word.title}
                </MenuItem>
              ))}
            </Menu>
          )}
        </ControlGroup>
        <EditWordDialog dictionary={dictionary} initialData={null} trigger={triggerRef}/>
      </>
    );

  }
);