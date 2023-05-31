export function raf(fn:FrameRequestCallback):number {
    return requestAnimationFrame(fn) 
}

export function cancelRaf(id:number) {
    cancelAnimationFrame(id)
} 