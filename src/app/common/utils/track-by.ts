export function trackBy(propName: string): (item: any) => boolean {
    return (item: any): boolean => {
        return item && (item.hasOwnProperty(propName) || null) && item[propName];
    };
}
