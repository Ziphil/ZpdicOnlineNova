//

import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import FileInput from "/client/component/atom/file-input";
import PaneList from "/client/component/compound/pane-list-beta";
import ResourcePane from "/client/component/compound/resource-pane";
import {
  create
} from "/client/component/create";
import {
  invalidateQueries,
  useIntl,
  usePopup,
  useRequest,
  useSuspenseQuery
} from "/client/component/hook";
import {
  Dictionary
} from "/client/skeleton/dictionary";
import {
  AwsUtil
} from "/client/util/aws";


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

    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup, addErrorPopup}] = usePopup();

    const number = dictionary.number;
    const [[resources]] = useSuspenseQuery("fetchResources", {number}, {keepPreviousData: true});
    const [file, setFile] = useState<File | null>(null);

    const uploadFile = useCallback(async function (): Promise<void> {
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
            await invalidateQueries("fetchResources", (data) => data.number === number);
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
    }, [number, file, request, addInformationPopup, addErrorPopup]);

    const node = (
      <div styleName="root">
        <div styleName="caution">
          {trans("resourceList.experimantalCaution")}
        </div>
        {(showInstruction) && (
          <div styleName="instruction">
            {(dictionary.settings.enableMarkdown) ? trans("resourceList.instruction") : trans("resourceList.markdownCaution")}
          </div>
        )}
        <div styleName="form">
          <FileInput inputLabel={trans("resourceList.file")} file={file} onSet={setFile}/>
          <Button label={trans("resourceList.confirm")} reactive={true} onClick={uploadFile}/>
        </div>
        <div styleName="list">
          <PaneList
            items={resources}
            size={size}
            column={2}
          >
            {(resource) => <ResourcePane key={resource} dictionary={dictionary} resource={resource} showCode={showCode}/>}
          </PaneList>
        </div>
      </div>
    );
    return node;

  }
);


export default ResouceList;