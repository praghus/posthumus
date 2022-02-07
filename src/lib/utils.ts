export function random(min: number, max: number): number {
    return min + Math.random() * (max - min)
}
export function randomInt(min: number, max: number): number {
    return Math.round(random(min, max))
}
export function randomChoice<T>(choices: T[]): T {
    return choices[randomInt(0, choices.length - 1)]
}
