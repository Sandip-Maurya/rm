export const interpolateRange = (
    frame: number,
    [inMin, inMax]: [number, number],
    [outMin, outMax]: [number, number]

): number => {
    const clampedFrame = Math.min(Math.max(frame, inMin), inMax);
    const progress = (clampedFrame - inMin) / (inMax - inMin);
    return outMin + progress * (outMax - outMin);
};