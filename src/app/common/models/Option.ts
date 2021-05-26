import { MultiString } from './MultiString';
import { OptionParams } from './OptionParams';
import { RenderImage } from './RenderImage';
import { StaticImage } from './StaticImage';

export class Option {
    id: string;
    params: OptionParams;
    name: string;
    category_ids: string[];
    display_name: MultiString;
    display_title: MultiString;
    display_desc: MultiString;
    extra_message: MultiString;
    color: string;
    only_image: boolean;
    static_image: StaticImage;
    render_image: RenderImage;
}

export enum PriceType {
    Simple = 'simple',
    StartingAt = 'startingAt'
}
