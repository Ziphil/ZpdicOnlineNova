//

import {faCheck, faInfoCircle} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, cloneElement, useCallback, useState} from "react";
import {
  Button,
  ButtonIconbag,
  Callout,
  CalloutBody,
  CalloutIconContainer,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogPane,
  GeneralIcon,
  MultiLineText,
  useTrans
} from "zographia";
import {ResourceList} from "/client/component/compound/resource-list/resource-list";
import {create} from "/client/component/create";
import {invalidateResponses, useRequest, useResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


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

    const {trans} = useTrans("resourceListDialog");

    const number = dictionary.number;
    const [[resources] = []] = useResponse("fetchResources", {number}, {keepPreviousData: true});

    const request = useRequest();

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    const enableMarkdown = useCallback(async function (): Promise<void> {
      const number = dictionary.number;
      const response = await request("changeDictionarySettings", {number, settings: {enableMarkdown: true}});
      await switchResponse(response, async () => {
        await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      });
    }, [dictionary.number, dictionary.paramName, request]);

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} height="full" {...rest}>
          <DialogPane styleName="pane">
            <DialogCloseButton/>
            <DialogBody>
              {(dictionary.settings.enableMarkdown) ? (
                <MultiLineText styleName="message" is="p">
                  {trans("message")}
                </MultiLineText>
              ) : (
                <Callout styleName="callout">
                  <CalloutIconContainer><GeneralIcon icon={faInfoCircle}/></CalloutIconContainer>
                  <CalloutBody styleName="callout-body">
                    <MultiLineText is="p">
                      {trans("callout")}
                    </MultiLineText>
                    <Button styleName="callout-button" variant="light" onClick={enableMarkdown}>
                      <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
                      {trans("button.enable")}
                    </Button>
                  </CalloutBody>
                </Callout>
              )}
              <ResourceList dictionary={dictionary} resources={resources} pageSpec={{size: 40}} showCode={true}/>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);