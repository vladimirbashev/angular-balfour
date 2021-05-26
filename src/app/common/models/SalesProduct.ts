import { Option } from './Option';
import { Question } from './Question';
import { QuestionGroup } from './QuestionGroup';

export class SalesProduct {
    id: string;
    question_groups: QuestionGroup[];
    questions: Question[];
    options: Option[];
    type: string;
}
