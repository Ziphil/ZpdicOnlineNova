//


/** 非同期処理を追加された順に 1 つずつ実行するキューを作成します。
 * ストリームのイベントハンドラ内から非同期処理を登録する際に利用します。
 * 各処理の失敗はキュー内で捕捉されるため未処理の rejection にならず、最初に発生したエラーが `settle` の呼び出し時に投げられます。
 * また、いずれかの処理が失敗した後は、後続の処理は実行されません。*/
export function createSequentialQueue(): SequentialQueue {
  let firstError = null as unknown;
  let promise = Promise.resolve();
  const enqueue = function (task: () => Promise<void>): void {
    promise = promise.then(async () => {
      if (firstError === null) {
        await task();
      }
    }).catch((error) => {
      if (firstError === null) {
        firstError = error;
      }
    });
  };
  const settle = async function (): Promise<void> {
    await promise;
    if (firstError !== null) {
      throw firstError;
    }
  };
  return {enqueue, settle};
}


export type SequentialQueue = {
  enqueue: (task: () => Promise<void>) => void,
  settle: () => Promise<void>
};
