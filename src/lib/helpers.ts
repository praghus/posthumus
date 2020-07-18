export const noop = Function.prototype

export const isProduction = process.env.NODE_ENV === 'production'

export const isValidArray = (arr: any) => arr && arr.length

export const getPerformance = () => typeof performance !== 'undefined' && performance.now()

export const requireAll = (requireContext: any) => requireContext.keys().map(requireContext)

export const getFilename = (path: string) => path.replace(/^.*[\\/]/, '').split('.').slice(0, -1).join('.')

export const random = (min: number, max: number) => (min + (Math.random() * (max - min)))

export const randomInt = (min: number, max: number) => Math.round(random(min, max))

export const randomChoice = (choices: []) => choices[randomInt(0, choices.length - 1)]

export const approach = (start: number, end: number, shift: number, delta = 1) => start < end 
    ? Math.min(start + shift * delta, end * delta) 
    : Math.max(start - shift * delta, end * delta)

export const shake = (ctx: CanvasRenderingContext2D, magnitude: number): void => {
    const dx = Math.random() * magnitude
    const dy = Math.random() * magnitude
    ctx.translate(dx, dy)  
}


