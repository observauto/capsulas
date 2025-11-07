declare module 'canvas-confetti' {
  type Options = Record<string, unknown>;
  type Confetti = (options?: Options) => unknown;

  const confetti: Confetti;
  export default confetti;
}
