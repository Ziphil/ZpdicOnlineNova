//

import {faNote, faUser} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, Card, CardBody, GeneralIcon, SingleLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useQuery} from "/client-new/hook/request";
import {DetailedDictionary, UserDictionary} from "/client-new/skeleton";
import {DictionaryHistoryChart} from "./dictionary-history-chart";


export const DictionaryCard = create(
  require("./dictionary-card.scss"), "DictionaryCard",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DetailedDictionary | UserDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber, transDate} = useTrans("dictionaryList");

    const number = dictionary.number;
    const from = useMemo(() => dayjs().subtract(16, "day").toISOString(), []);
    const [histories] = useQuery("fetchHistories", {number, from}, {staleTime: 1 / 0, refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false});

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="left">
            <div>
              <SingleLineText styleName="name" is="h3">
                {dictionary.name}
              </SingleLineText>
              <div styleName="user">
                <GeneralIcon styleName="icon" icon={faUser}/>
                {dictionary.user.screenName}
              </div>
            </div>
            <dl styleName="table">
              <dt styleName="table-label">{trans("updatedDate")}</dt>
              <dd styleName="table-value">{transDate(dictionary.updatedDate)}</dd>
              <dt styleName="table-label">{trans("createdDate")}</dt>
              <dd styleName="table-value">{transDate(dictionary.createdDate)}</dd>
            </dl>
          </div>
          {(histories !== undefined && histories.length > 0) && (
            <div styleName="right">
              <DictionaryHistoryChart dictionary={dictionary} histories={histories}/>
              <div styleName="word-count">
                <GeneralIcon styleName="icon" icon={faNote}/>
                {transNumber(histories[0].wordSize)}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    );

  }
);