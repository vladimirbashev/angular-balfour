import { ConfigurationPricing } from './ConfigurationPricing';
import { ConfigurationSurcharge } from './ConfigurationSurcharge';
import { Dialog } from './Dialog';
import { MultiString } from './MultiString';
import { Option } from './Option';
import { Question } from './Question';
import { QuestionGroup } from './QuestionGroup';
import { RenderImage } from './RenderImage';
import { ScheduledMessage } from './ScheduledMessage';
import { StaticImage } from './StaticImage';

// tslint:disable:variable-name
export class ProductConfiguration {
    id: string;
    product_id: string;
    organization_id: string;
    organization_filter_param: string;
    product_collection_id: string;
    name: string;
    question_groups: QuestionGroup[];
    questions: Question[];
    options: Option[];
    state: OptionStateTypes;
    title: MultiString;
    description: MultiString;
    display_details: MultiString;
    display_shipping: MultiString;
    unfinished_dialog: Dialog;
    quickturn_dialog: Dialog;
    above_message: MultiString;
    disclaimer: MultiString;
    scheduled_messages: ScheduledMessage[];
    default_image: string;
    render_image: RenderImage;
    static_images: StaticImage[];
    extra_images: { [key: string]: string }[];
    pricing: ConfigurationPricing[];
    surcharges: ConfigurationSurcharge[];
    image_default_color: any;
    image_default_type: any;
    vendor_id: string;
    creator_id: string;
    create_date: Date;
    update_date: Date;
    template: boolean;
    template_id: string;
    use_question_name_as_key: boolean;
    item_code: string;
    reseller_id: string;
}

export enum OptionStateTypes {
    IN_PROGRESS = 'in progress',
    VERIFY = 'verify',
    ACTIVE = 'active',
    DISABLED = 'disabled'
}

export enum ImageRenderType {
    Static = 'static',
    Liquifire = 'liquifire'
}