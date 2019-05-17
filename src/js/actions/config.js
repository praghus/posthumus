export const UPDATE_CONFIG = 'UPDATE_CONFIG'

export function updateConfig (key, value) {
    return {
        type: UPDATE_CONFIG,
        ...{key, value}
    }
}
