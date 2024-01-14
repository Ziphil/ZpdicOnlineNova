//

import {ReactElement, ReactNode} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {QueryClientProvider} from "react-query";
import {create} from "/client-new/component/create";
import {queryClient} from "/client-new/hook/request";


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
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    );

  }
);