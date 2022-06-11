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

    const [file, setFile] = useState<File | null>(null);
    const [dummy, setDummy] = useState({});
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup, addErrorPopup}] = usePopup();

    const provideResources = useCallback(async function (offset?: number, size?: number): Promise<WithSize<string>> {
      const number = dictionary.number;
      const response = await request("fetchResources", {number, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        const resources = response.data;
        return resources;
      } else {
        return [[], 0];
      }
    }, [dictionary.number, dummy, request]);

    const uploadFile = useCallback(async function (): Promise<void> {
      const number = dictionary.number;
      if (file) {
        const name = file.name;
        const type = file.type;
        const response = await request("fetchUploadResourcePost", {number, name, type}, {useRecaptcha: true});
        if (response.status === 200 && !("error" in response.data)) {
          const post = response.data;
          try {
            await AwsUtil.uploadFile(post, file);
            addInformationPopup("resourceUploaded");
            setFile(null);
            setDummy({});
          } catch (error) {
            if (error.name === "AwsError") {
              const code = error.data["Code"]["_text"];
              const message = error.data["Message"]["_text"];
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

    const renderResource = useCallback(function (resource: string): ReactNode {
      const node = (
        <ResourcePane dictionary={dictionary} resource={resource} showCode={showCode} onDiscardConfirm={() => setDummy({})}/>
      );
      return node;
    }, [dictionary, showCode]);

    const instructionText = (dictionary.settings.enableMarkdown) ? trans("resourceList.instruction") : trans("resourceList.markdownCaution");
    const instructionNode = (showInstruction) && (
      <div styleName="instruction">
        {instructionText}
      </div>
    );
    const node = (
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
          <PaneList items={provideResources} size={size} column={2} renderer={renderResource}/>
        </div>
      </div>
    );
    return node;

  }
);


export default ResouceList;