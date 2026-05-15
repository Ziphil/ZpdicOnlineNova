//

import {useEffect} from "react";


export function usePolling(job: () => Promise<boolean>, interval: number): void {
  useEffect(() => {
    let cancelled = false;
    let timeout = undefined as ReturnType<typeof setTimeout> | undefined;
    const run = async function (): Promise<void> {
      const done = await job();
      if (!cancelled && !done) {
        timeout = setTimeout(() => run(), interval);
      }
    };
    run();
    return () => {
      cancelled = true;
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
    };
  }, [job, interval]);
}