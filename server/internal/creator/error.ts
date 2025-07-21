//

import type {
  CustomError as CustomErrorSkeleton
} from "/server/internal/skeleton";


export namespace CustomErrorCreator {

  export function ofType<E extends string>(type: E, code?: number): CustomErrorSkeleton<E> {
    const skeleton = {
      error: "CustomError",
      type,
      code
    } satisfies CustomErrorSkeleton<E>;
    return skeleton;
  }

}