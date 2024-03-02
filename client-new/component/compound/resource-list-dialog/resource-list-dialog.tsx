//

import {Fragment, ReactElement, cloneElement, useCallback, useState} from "react";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogPane,
  useTrans
} from "zographia";
import {ResourceList} from "/client-new/component/compound/resource-list/resource-list";
import {create} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {EnhancedDictionary} from "/client-new/skeleton";


export const ResourceListDialog = create(
  require("./resource-list-dialog.scss"), "ResourceListDialog",
  function ({
    dictionary,
    trigger,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editWordDialog");

    const number = dictionary.number;
    const [[resources] = []] = useResponse("fetchResources", {number}, {keepPreviousData: true});

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} height="full" {...rest}>
          <DialogPane styleName="pane">
            <DialogCloseButton/>
            <DialogBody>
              <ResourceList dictionary={dictionary} resources={resources} pageSpec={{size: 40}} showCode={true}/>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);