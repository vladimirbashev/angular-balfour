import { Answer } from './Answer';
import { Constraint } from './Constraint';
import { ControlConfiguration } from './ControlConfiguration';
import { Dialog } from './Dialog';
import { DisplayConfiguration } from './DisplayConfiguration';
import { MultiString } from './MultiString';
import { RenderImage } from './RenderImage';

export class Question {
    id: string;
    parent_id: string;
    control: QuestionControls;
    control_config: ControlConfiguration;
    input_validation: string;
    name: string;
    description: string;
    constraints: Constraint[];
    answers: Answer[];
    default_answer: string;
    group_id: string;
    display_name: MultiString;
    display_desc: MultiString;
    section: OrderFormSections;
    extra_info: Dialog;
    display_config: DisplayConfiguration;
    vendor_id: string;
    image: RenderImage;
    hide_by_default: boolean;
    mmv: string;
    use_question_name_as_key: boolean;
    item_code_name: string;
    extra_note: string;
    required: string;
}

export enum QuestionControls {
    BLANK = 'Blank',
    DROPDOWN_SELECT = 'DropdownSelect',
    INPUT_RADIO = 'InputRadio',
    IMAGE_SELECT = 'ImageSelect',
    INSIDE_ENGRAVING = 'InsideEngraving',
    TEXT_INPUT = 'TextInput',
    DIALOG_SELECT = 'DialogSelect',
    LOCKED = 'Locked',
    COMPLEX_IMAGE_SELECT = 'ComplexImageSelect',
    SCHOOL_FINDER = 'SchoolFinder',
    DATA_PICKER = 'DatePicker',
    SUBQUESTION_CONTROL_GRID = 'SubquestionControlGrid',
    DROPDOWN_IMAGE_GRID = 'DropdownImageGrid',
    SAVE_LINK = 'SaveLink'
}

export enum OrderFormSections {
    BAND_SIZE = 'bandSize',
    METAL = 'metal',
    SIDE = 'side',
    STONE = 'stone',
    CARE_PLAN = 'carePlan',
    STUDENT_CLASS = 'studentClass',
    IGNORE = 'ignore',
    OTHER = 'other'
}

export const questionControlType = {
    [QuestionControls.INPUT_RADIO]: {
        default: 'default',
        image: 'image',
        text: 'text'
    },
    [QuestionControls.DROPDOWN_SELECT]: {
        default: 'default',
        color: 'color'
    }
};

export class QuestionControlMeta {
    control: QuestionControls;
    formlyType: string;
    hasOptions: boolean;
}

export const questionControlFormlyType: { [control: string]: QuestionControlMeta } = {
    [QuestionControls.INPUT_RADIO]: {
        control: QuestionControls.INPUT_RADIO,
        formlyType: 'rep-radio',
        hasOptions: true
    } as QuestionControlMeta,
    [QuestionControls.TEXT_INPUT]: {
        control: QuestionControls.TEXT_INPUT,
        formlyType: 'input',
        hasOptions: false
    } as QuestionControlMeta,
    [QuestionControls.DROPDOWN_SELECT]: {
        control: QuestionControls.DROPDOWN_SELECT,
        formlyType: 'rep-select',
        hasOptions: true
    } as QuestionControlMeta
};
