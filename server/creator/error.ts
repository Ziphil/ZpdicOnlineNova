//

import type {
  CustomError as CustomErrorSkeleton
} from "/client/skeleton";


export namespace CustomErrorCreator {

  export function ofType<E extends string>(type: E, code?: number): CustomErrorSkeleton<E> {
    const error = "CustomError" as const;
    const skeleton = {error, type, code};
    return skeleton;
  }

}