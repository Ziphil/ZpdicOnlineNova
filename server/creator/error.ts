//

import type {
  CustomError as CustomErrorSkeleton
} from "/client/skeleton";


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