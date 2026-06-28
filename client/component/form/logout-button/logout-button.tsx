//

import {faSignOutAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useLogoutRequest} from "/client/hook/auth";


export const LogoutButton = create(
  require("../common.scss"), "LogoutButton",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("logoutButton");

    const navigate = useNavigate();

    const logout = useLogoutRequest();

    const handleSubmit = useCallback(async function (): Promise<void> {
      await logout();
      navigate("/");
    }, [logout, navigate]);

    return (
      <div>
        <Button scheme="primary" variant="light" onClick={handleSubmit} {...rest}>
          <ButtonIconbag><GeneralIcon icon={faSignOutAlt}/></ButtonIconbag>
          {trans("button.submit")}
        </Button>
      </div>
    );

  }
);