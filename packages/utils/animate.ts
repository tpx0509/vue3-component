export function raf(fn:FrameRequestCallback):number {
    return requestAnimationFrame(fn) 
}

export function cancelRaf(id:number) {
    cancelAnimationFrame(id)
} 
// double raf for animation
export function doubleRaf(fn: FrameRequestCallback): void {
    raf(() => raf(fn));
}
  