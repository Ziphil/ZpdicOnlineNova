//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, CardFooter, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Commission} from "/client-new/skeleton";


export const CommissionCard = create(
  require("./commission-card.scss"), "CommissionCard",
  function ({
    commission,
    ...rest
  }: {
    commission: Commission,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber, transDate} = useTrans("commissionList");

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
        </CardBody>
        <CardFooter styleName="footer">
        </CardFooter>
      </Card>
    );

  }
);