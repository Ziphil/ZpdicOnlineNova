//

import {
  useRouter
} from "@tanstack/react-location";
import * as react from "react";
import {
  ReactElement,
  useEffect
} from "react";
import {
  Helmet
} from "react-helmet";
import {
  create
} from "/client/component/create";
import {
  GtagUtil
} from "/client/util/gtag";


const GoogleAnalytics = create(
  null, "GoogleAnalytics",
  function ({
    id
  }: {
    id?: string
  }): ReactElement | null {

    const router = useRouter();

    useEffect(() => {
      if (id !== undefined && !router.pending) {
        GtagUtil.event("page_view", [["page_path", location.pathname]]);
      }
    }, [id, router.pending]);

    const node = (id !== undefined) && (
      <Helmet>
        <script async={true} src={`https://www.googletagmanager.com/gtag/js?id=${id}`}/>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "${id}", {send_page_view: false});
          `}
        </script>
      </Helmet>
    );
    return node || null;

  }
);


export default GoogleAnalytics;