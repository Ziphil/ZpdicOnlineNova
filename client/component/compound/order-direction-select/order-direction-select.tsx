/* eslint-disable react/jsx-closing-bracket-location, react/jsx-closing-tag-location */

import {faArrowDownAZ, faArrowDownZA} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, Select, SelectOption, useTrans} from "zographia";
import {create} from "/client/component/create";


export const OrderDirectionSelect = create(
  require("./order-direction-select.scss"), "OrderDirectionSelect",
  function ({
    orderDirection,
    onSet,
    ...rest
  }: {
    orderDirection: OrderDirection,
    onSet?: (orderDirection: OrderDirection) => unknown,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("orderDirectionSelect");

    return (
      <Select styleName="root" value={orderDirection} onSet={onSet} {...rest}>
        <SelectOption value="ascending" label={<>
          <GeneralIcon styleName="icon" icon={faArrowDownAZ}/>
          {trans("ascending")}
        </>}>
          <GeneralIcon styleName="icon" icon={faArrowDownAZ}/>
          {trans("ascending")}
        </SelectOption>
        <SelectOption value="descending" label={<>
          <GeneralIcon styleName="icon" icon={faArrowDownZA}/>
          {trans("descending")}
        </>}>
          <GeneralIcon styleName="icon" icon={faArrowDownZA}/>
          {trans("descending")}
        </SelectOption>
      </Select>
    );

  }
);


export type OrderDirection = "ascending" | "descending";