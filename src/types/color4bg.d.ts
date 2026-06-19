declare module 'color4bg' {
  export class AestheticFluidBg {
    constructor(options: { dom: HTMLElement; colors: string[]; speed?: number; blur?: number });
    start(): void;
    destroy(): void;
  }
}