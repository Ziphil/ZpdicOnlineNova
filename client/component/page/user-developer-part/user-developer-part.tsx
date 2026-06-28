//

import {ReactElement, useMemo} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {ApiCredentialList} from "/client/component/compound/api-credential-list";
import {create} from "/client/component/create";
import {GenerateMyApiCredentialForm, useGenerateMyApiCredential} from "/client/component/form/generate-my-api-credential-form";
import {useMe} from "/client/hook/auth";
import {useResponse} from "/client/hook/request";
import {ApiCredential} from "/server/internal/skeleton";


export const UserDeveloperPart = create(
  require("./user-developer-part.scss"), "UserDeveloperPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans, transNode} = useTrans("userDeveloperPart");

    const me = useMe();
    const {name} = useParams();

    const [apiCredentials] = useResponse("fetchMyApiCredentials", {});

    const {credential, handleSubmit} = useGenerateMyApiCredential();
    const credentials = useMemo(() => (apiCredentials !== undefined) ? mergeCredentials(apiCredentials, credential) : undefined, [apiCredentials, credential]);

    return (me !== null && me.name === name) ? (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.apiKey")}</h3>
          <MultiLineText styleName="description">
            {transNode("description.apiKey", {
              documentLink: (parts) => <Link href="/document/other/api" variant="unstyledUnderline">{parts}</Link>,
              specificationLink: (parts) => <Link href="/api" variant="unstyledUnderline">{parts}</Link>
            })}
          </MultiLineText>
          <div styleName="list-container">
            <GenerateMyApiCredentialForm onSubmit={handleSubmit}/>
            <ApiCredentialList credentials={credentials}/>
          </div>
        </section>
      </div>
    ) : null;

  }
);


/** API から取得した API キー一覧 (キー本体なし) に対し、発行直後に保持しているキー本体を id で照合して上書きします。
 * 取得した一覧に含まれていない保持中のキーは表示しません。
 * これにより、削除されて一覧から消えたキーが、保持中のキーとして表示され続けることを防ぎます。*/
function mergeCredentials(credentials: Array<ApiCredential>, generatedCredential: ApiCredential | null): Array<ApiCredential> {
  if (generatedCredential !== null) {
    const mergedCredentials = credentials.map((credential) => (credential.id === generatedCredential.id) ? generatedCredential : credential);
    return mergedCredentials;
  } else {
    return credentials;
  }
}