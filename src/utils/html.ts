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

export function getScale(element: HTMLElement): { scaleX: number; scaleY: number } {
    const style = window.getComputedStyle(element);
    const transform = style.transform;

    let scaleX = 1;
    let scaleY = 1;

    if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix\(([^\)]+)\)/)![1].split(',').map(Number);
        scaleX = matrix[0];
        scaleY = matrix[3];
    }

    return { scaleX, scaleY };
}