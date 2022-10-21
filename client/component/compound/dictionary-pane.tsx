//

import downloadFile from "js-file-download";
import {
  MouseEvent,
  ReactElement,
  useCallback,
  useMemo
} from "react";
import Button from "/client/component/atom/button";
import Chart from "/client/component/atom/chart";
import {
  ChartData
} from "/client/component/atom/chart";
import WhitePane from "/client/component/compound/white-pane";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  usePath,
  useQuery,
  useRequest,
  useTrans
} from "/client/component/hook";
import {
  DetailedDictionary
} from "/client/skeleton/dictionary";
import {
  History
} from "/client/skeleton/history";


const DictionaryPane = create(
  require("./dictionary-pane.scss"), "DictionaryPane",
  function ({
    dictionary,
    showUser = true,
    showUpdatedDate = true,
    showCreatedDate = false,
    showChart = true,
    showSettingLink = false,
    showDownloadLink = false,
    styles
  }: {
    dictionary: DetailedDictionary,
    showUser?: boolean,
    showUpdatedDate?: boolean,
    showCreatedDate?: boolean,
    showChart?: boolean,
    showSettingLink?: boolean,
    showDownloadLink?: boolean,
    styles?: StylesRecord
  }): ReactElement {

    const {request} = useRequest();
    const {trans, transDate} = useTrans("dictionaryPane");
    const {pushPath} = usePath();

    const number = dictionary.number;
    const from = useMemo(() => new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toString(), []);
    const [histories] = useQuery("fetchHistories", {number, from}, {enabled: showChart, staleTime: 1 / 0, refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false});

    const jumpSettingPage = useCallback(function (event: MouseEvent<HTMLElement>): void {
      event.preventDefault();
      event.stopPropagation();
      const path = "/dashboard/dictionary/" + dictionary.number;
      pushPath(path);
    }, [dictionary.number, pushPath]);

    const downloadDictionary = useCallback(async function (event: MouseEvent<HTMLElement>): Promise<void> {
      event.preventDefault();
      event.stopPropagation();
      if (dictionary) {
        const number = dictionary.number;
        const response = await request("downloadDictionary", {number}, {responseType: "blob"});
        if (response.status === 200 && !("error" in response.data)) {
          const data = response.data;
          const disposition = response.headers["content-disposition"];
          const match = disposition.match(/filename="(.+)"/);
          const encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
          const fileName = (() => {
            if (encodedMatch !== null) {
              return decodeURIComponent(encodedMatch[1]).replace(/\+/g, " ");
            } else if (match !== null) {
              return match[1];
            } else {
              return "dictionary.json";
            }
          })();
          downloadFile(data, fileName);
        }
      }
    }, [dictionary, request]);

    const name = dictionary.name;
    const href = "/dictionary/" + (dictionary.paramName ?? dictionary.number);
    const chartSpec = useMemo(() => calcChartSpec(histories), [histories]);
    const config = useMemo(() => (chartSpec !== undefined) && {
      padding: {top: 0, bottom: 0, left: 0, right: 0},
      axis: {
        x: {max: chartSpec.maxXAxis, min: chartSpec.minXAxis, padding: {left: 0, right: 0}, type: "timeseries", show: false} as const,
        y: {max: chartSpec.maxYAxis, min: chartSpec.minYAxis, padding: {top: 1, bottom: 1}, show: false}
      },
      grid: {
        x: {show: false},
        y: {show: false}
      },
      interaction: {enabled: false}
    }, [chartSpec]);
    const node = (
      <WhitePane href={href} clickable={true}>
        <div styleName="main">
          <div styleName="left">
            <div styleName="name">{name}</div>
            <div styleName="information">
              {(showUpdatedDate) && (
                <div styleName="information-item">{trans("updatedDate")} — {transDate(dictionary.updatedDate)}</div>
              )}
              {(showCreatedDate) && (
                <div styleName="information-item">{trans("createdDate")} — {transDate(dictionary.createdDate)}</div>
              )}
              {(showUser) && (
                <div styleName="information-item">{trans("userName")} — {dictionary.user.screenName}</div>
              )}
            </div>
          </div>
          <div styleName="right">
            {useMemo(() => (showChart && chartSpec && config) && (
              <Chart className={styles!["chart"]} data={chartSpec.data} config={config}/>
            ), [chartSpec, config, showChart, styles])}
          </div>
        </div>
        {(showSettingLink || showDownloadLink) && (
          <div styleName="button-group">
            {(showSettingLink) && (
              <Button label={trans("setting")} iconName="cog" variant="simple" onClick={jumpSettingPage}/>
            )}
            {(showDownloadLink) && (
              <Button label={trans("download")} iconName="download" variant="simple" onClick={downloadDictionary}/>
            )}
          </div>
        )}
      </WhitePane>
    );
    return node;

  }
);


function calcChartSpec(histories?: Array<History>): {data: ChartData, maxXAxis: Date, minXAxis: Date, maxYAxis: number, minYAxis: number} | undefined {
  if (histories) {
    const dates = [];
    const differences = [];
    for (let i = 0 ; i < histories.length - 1 ; i ++) {
      const difference = histories[i].wordSize - histories[i + 1].wordSize;
      const duration = new Date(histories[i].date).getTime() - new Date(histories[i + 1].date).getTime();
      const revisedDifference = difference / (duration / (24 * 60 * 60 * 1000));
      const trimmedDifference = Math.max(Math.min(revisedDifference, 20), 0);
      dates.push(new Date(histories[i].date));
      differences.push(trimmedDifference);
    }
    const data = {x: "date", columns: [["date", ...dates], ["wordSize", ...differences]], types: {wordSize: "line"}} as ChartData;
    const maxXAxis = dates[0];
    const minXAxis = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    return {data, maxXAxis, minXAxis, maxYAxis: 20, minYAxis: 0};
  } else {
    return undefined;
  }
}

export default DictionaryPane;