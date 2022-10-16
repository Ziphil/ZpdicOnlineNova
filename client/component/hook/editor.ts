//

import {
  nanoid
} from "nanoid";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback
} from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from "recoil";
import type ExampleEditor from "/client/component/compound/example-editor";
import type WordEditor from "/client/component/compound/word-editor";


export function createEditor<P extends WordEditorProps | ExampleEditorProps>(): [() => (props: P) => void, () => UseEditorPropsReturn<P>] {
  const atomId = nanoid();
  const editorPropsAtom = atom<Array<ExtendedEditorProps<P>>>({key: `editorProps-${atomId}`, default: [], dangerouslyAllowMutability: true});
  const editorOpenAtom = atom({key: `editorOpen-${atomId}`, default: false});
  const editingIdAtom = atom({key: `editingId-${atomId}`, default: ""});
  const useEditor = function (): (props: P) => void {
    const setEditorProps = useSetRecoilState(editorPropsAtom);
    const setEditorOpen = useSetRecoilState(editorOpenAtom);
    const setEditingId = useSetRecoilState(editingIdAtom);
    const addEditor = useCallback(function (props: P): void {
      const id = nanoid();
      const name = ("word" in props) ? props.word?.name : props.example?.sentence;
      const onTempSet = function (tempItem: any): void {
        const name = ("name" in tempItem) ? tempItem.name : tempItem.sentence;
        setEditorProps((editorProps) => editorProps.map((editorProp) => (editorProp.id === id) ? {...editorProp, name} : editorProp));
      };
      const onEditConfirm = async function (item: any, event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onEditConfirm?.(item, event);
        setEditorProps((previousProps) => previousProps.filter((previousProp) => previousProp.id !== id));
      };
      const onDiscardConfirm = async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onDiscardConfirm?.(event);
        setEditorProps((previousProps) => previousProps.filter((previousProp) => previousProp.id !== id));
      };
      const onCancel = async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onCancel?.(event);
        setEditorProps((previousProps) => previousProps.filter((previousProp) => previousProp.id !== id));
      };
      setEditorProps((previousProps) => [...previousProps, {id, name, ...props, onTempSet, onEditConfirm, onDiscardConfirm, onCancel}]);
      setEditorOpen(true);
      setEditingId(id);
    }, [setEditorProps, setEditorOpen, setEditingId]);
    return addEditor;
  };
  const useEditorProps = function (): UseEditorPropsReturn<P> {
    const editorProps = useRecoilValue(editorPropsAtom);
    const [editorOpen, setEditorOpen] = useRecoilState(editorOpenAtom);
    const [editingId, setEditingId] = useRecoilState(editingIdAtom);
    return {editorProps, editorOpen, setEditorOpen, editingId, setEditingId};
  };
  return [useEditor, useEditorProps];
}

export const [useWordEditor, useWordEditorProps] = createEditor<WordEditorProps>();
export const [useExampleEditor, useExampleEditorProps] = createEditor<ExampleEditorProps>();

type ExtendedEditorProps<P> = P & {id: string, name?: string};
type WordEditorProps = Parameters<typeof WordEditor>[0];
type ExampleEditorProps = Parameters<typeof ExampleEditor>[0];

type UseEditorPropsReturn<P> = {
  editorProps: Array<ExtendedEditorProps<P>>,
  editorOpen: boolean,
  setEditorOpen: Dispatch<SetStateAction<boolean>>,
  editingId: string,
  setEditingId: Dispatch<SetStateAction<string>>
};