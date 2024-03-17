//

import {ReactElement, ReactNode} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {QueryClientProvider} from "react-query";
import {RecoilRoot} from "recoil";
import {create} from "/client/component/create";
import {queryClient} from "/client/hook/request";


export const ProviderRoot = create(
  null, "ProviderRoot",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement | null {

    return (
      <ErrorBoundary fallbackRender={() => <div>Please Reload</div>}>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            {children}
          </RecoilRoot>
        </QueryClientProvider>
      </ErrorBoundary>
    );

  }
);