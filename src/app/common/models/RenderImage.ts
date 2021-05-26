export class RenderImage {
    render_category: string;
    render_views: ('top' | 'left' | 'right' | 'front' | 'back' | 'side1' | 'side2')[];
    render_key: string;
    render_api_version: string;
    default_render_value: 'natural' | 'White_spinel_smooth' | 'HS_Identity_Enhancement_Anchor_lg' | 'dgreen' | '050';
    extra_params: { [key: string]: string };
}
