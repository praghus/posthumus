export const RESIZE_SCREEN = 'RESIZE_SCREEN'

export function resizeScreen (width, height) {
    return {
        type: RESIZE_SCREEN,
        width: width,
        height: height
    }
}
