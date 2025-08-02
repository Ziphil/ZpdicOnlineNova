//

import {ObjectId} from "/server/internal/skeleton/common";
import {TemplateSection} from "/server/internal/skeleton/template-word/template-section";


export interface EditableTemplateWord {

  id: ObjectId | null;
  title: string;
  name: string;
  pronunciation: string;
  tags: Array<string>;
  sections: Array<TemplateSection>;

}


export namespace EditableTemplateWord {

  export const EMPTY = {
    id: null,
    title: "",
    name: "",
    pronunciation: "",
    tags: [],
    sections: []
  } satisfies EditableTemplateWord;

}


export interface TemplateWord {

  id: ObjectId;
  title: string;
  name: string;
  pronunciation: string;
  tags: Array<string>;
  sections: Array<TemplateSection>;

}