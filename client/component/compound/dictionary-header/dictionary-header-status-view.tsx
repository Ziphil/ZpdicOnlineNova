/* eslint-disable react/jsx-closing-bracket-location */

import {faNote, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";


export const DictionaryHeaderStatusView = create(
  require("./dictionary-header-status-view.scss"), "DictionaryHeaderStatusView",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber, transDate} = useTrans("dictionaryHeader");

    const [sizes] = useResponse("fetchDictionarySizes", {number: dictionary.number});

    return (
      <div styleName="root" {...rest}>
        {(sizes !== undefined) && (
          <div styleName="count-list">
            <div styleName="count">
              <GeneralIcon styleName="icon" icon={faNote}/>
              <span styleName="count-number">{transNumber(sizes.word)}</span>
            </div>
            <div styleName="count">
              <GeneralIcon styleName="icon" icon={faQuotes}/>
              <span styleName="count-number">{transNumber(sizes.example)}</span>
            </div>
          </div>
        )}
        <dl styleName="table">
          <dt styleName="table-label">{trans("table.updatedDate")}</dt>
          <dd styleName="table-value"><time dateTime={dayjs(dictionary.updatedDate).toISOString()}>{transDate(dictionary.updatedDate)}</time></dd>
          <dt styleName="table-label">{trans("table.createdDate")}</dt>
          <dd styleName="table-value"><time dateTime={dayjs(dictionary.createdDate).toISOString()}>{transDate(dictionary.createdDate)}</time></dd>
        </dl>
      </div>
    );

  }
);
