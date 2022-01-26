//

import * as react from "react";
import {
  ReactElement,
  ReactNode,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import FileInput from "/client/component/atom/file-input";
import PaneList from "/client/component/compound/pane-list";
import ResourcePane from "/client/component/compound/resource-pane";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  Dictionary
} from "/client/skeleton/dictionary";
import {
  AwsUtil
} from "/client/util/aws";
import {
  WithSize
} from "/server/controller/internal/type";


const ResouceList = create(
  require("./resource-list.scss"), "ResouceList",
  function ({
    dictionary,
    size,
    showCode,
    showInstruction = false
  }: {
    dictionary: Dictionary,
    size: number,
    showCode?: boolean,
    showInstruction?: boolean
  }): ReactElement {

    let [file, setFile] = useState<File | null>(null);
    let [dummy, setDummy] = useState({});
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup, addErrorPopup}] = usePopup();

    let provideResources = useCallback(async function (offset?: number, size?: number): Promise<WithSize<string>> {
      let number = dictionary.number;
      let response = await request("fetchResources", {number, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        let resources = response.data;
        return resources;
      } else {
        return [[], 0];
      }
    }, [dictionary.number, dummy, request]);

    let uploadFile = useCallback(async function (): Promise<void> {
      let number = dictionary.number;
      if (file) {
        let name = file.name;
        let type = file.type;
        let response = await request("fetchUploadResourcePost", {number, name, type}, {useRecaptcha: true});
        if (response.status === 200 && !("error" in response.data)) {
          let post = response.data;
          try {
            await AwsUtil.uploadFile(post, file);
            addInformationPopup("resourceUploaded");
            setFile(null);
            setDummy({});
          } catch (error) {
            if (error.name === "AwsError") {
              let code = error.data["Code"]["_text"];
              let message = error.data["Message"]["_text"];
              if (code === "EntityTooLarge") {
                addErrorPopup("resourceSizeTooLarge");
              } else if (code === "AccessDenied" && message.includes("Policy Condition failed") && message.includes("$Content-Type")) {
                addErrorPopup("unsupportedResourceType");
              } else {
                addErrorPopup("awsError");
              }
            } else {
              addErrorPopup("awsError");
            }
          }
        }
      }
    }, [dictionary.number, file, request, addInformationPopup, addErrorPopup]);

    let renderResource = useCallback(function (resource: string): ReactNode {
      let node = (
        <ResourcePane dictionary={dictionary} resource={resource} showCode={showCode} onDiscardConfirm={() => setDummy({})}/>
      );
      return node;
    }, [dictionary, showCode]);

    let instructionText = (dictionary.settings.enableMarkdown) ? trans("resourceList.instruction") : trans("resourceList.markdownCaution");
    let instructionNode = (showInstruction) && (
      <div styleName="instruction">
        {instructionText}
      </div>
    );
    let node = (
      <div styleName="root">
        <div styleName="caution">
          {trans("resourceList.experimantalCaution")}
        </div>
        {instructionNode}
        <div styleName="form">
          <FileInput inputLabel={trans("resourceList.file")} file={file} onSet={(file) => setFile(file)}/>
          <Button label={trans("resourceList.confirm")} reactive={true} onClick={uploadFile}/>
        </div>
        <div styleName="list">
          <PaneList items={provideResources} size={size} column={2} method="table" style="spaced" border={true} renderer={renderResource}/>
        </div>
      </div>
    );
    return node;

  }
);


export default ResouceList;