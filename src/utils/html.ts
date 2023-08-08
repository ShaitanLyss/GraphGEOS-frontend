export function getTranslateValues(element: HTMLElement): { translateX: number; translateY: number } {
    const style = window.getComputedStyle(element);
    const transform = style.transform;

    if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix.*\((.+)\)/)![1].split(',').map(Number);
        const translateX = matrix[4];
        const translateY = matrix[5];
        return { translateX, translateY };
    }

    return { translateX: 0, translateY: 0 };
}