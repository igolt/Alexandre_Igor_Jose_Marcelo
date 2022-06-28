import { FrameSet, AnimationMode, IAnimation, Animation } from "./Animation";
import { GameObject } from "./GameObject";

export class Carrot extends GameObject implements IAnimation {
  private animation: Animation;
  private baseX: number;
  private baseY: number;
  private positionX: number;
  private positionY: number;

  public constructor(x: number, y: number) {
    super(x, y, 7, 14);

    this.animation = new Animation([12, 13], 15);
    // baseX e baseY são o ponto no qual a carrot se move. positionX
    // e y são usados para acompanhar o vetor distante do ponto base para dar
    // a cenoura um efeito flutuante
    this.baseX = x;
    this.baseY = y;

    this.positionX = Math.random() * Math.PI * 2;
    this.positionY = this.positionX * 2;
  }

  public animate(): void {
    this.animation.animate();
  }

  public frameValue(): number {
    return this.animation.frameValue();
  }

  public changeFrameSet(
    frameSet: FrameSet,
    mode?: AnimationMode,
    delay?: number,
    frameIndex?: number
  ): void {
    this.animation.changeFrameSet(frameSet, mode, delay, frameIndex);
  }

  public updatePosition() {
    this.positionX += 0.1;
    this.positionY += 0.2;

    this.setX(this.baseX + Math.cos(this.positionX) * 2);
    this.setY(this.baseY + Math.cos(this.positionY));
  }
}