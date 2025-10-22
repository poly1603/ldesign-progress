import { CountdownProgressOptions } from '../types';
import { ProgressBase } from '../base';
import { createSVGElement } from '../utils';

/**
 * CountdownProgress - 倒计时进度条
 */
export class CountdownProgress extends ProgressBase<CountdownProgressOptions> {
  private svg!: SVGSVGElement;
  private trackCircle!: SVGCircleElement;
  private progressCircle!: SVGCircleElement;
  private timeText!: HTMLElement;
  private labelText?: HTMLElement;
  private circumference: number = 0;
  private startTime: number = 0;
  private duration: number = 0;
  private timerInterval?: any;

  protected getDefaultOptions(): Partial<CountdownProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      radius: 80,
      strokeWidth: 10,
      countdownDuration: 60, // 秒
      showTime: true,
      timeFormat: 'mm:ss',
      autoStart: false,
    };
  }

  protected render(): void {
    this.container.innerHTML = '';

    const radius = this.config.get('radius') ?? 80;
    const strokeWidth = this.config.get('strokeWidth') ?? 10;
    const size = (radius + strokeWidth) * 2;

    // 创建 SVG
    this.svg = createSVGElement('svg', {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      class: 'ld-progress-countdown',
    }) as SVGSVGElement;

    const className = this.config.get('className');
    if (className) {
      this.svg.classList.add(className);
    }

    this.container.appendChild(this.svg);

    const center = size / 2;

    // 创建轨道
    this.trackCircle = createSVGElement('circle', {
      cx: center,
      cy: center,
      r: radius,
      fill: 'none',
      stroke: '#e4e7ed',
      'stroke-width': strokeWidth,
      class: 'ld-progress-countdown__track',
    }) as SVGCircleElement;
    this.svg.appendChild(this.trackCircle);

    // 创建进度圆
    this.progressCircle = createSVGElement('circle', {
      cx: center,
      cy: center,
      r: radius,
      fill: 'none',
      'stroke-width': strokeWidth,
      'stroke-linecap': 'round',
      class: 'ld-progress-countdown__progress',
    }) as SVGCircleElement;

    const color = this.config.get('color');
    const strokeColor = Array.isArray(color) ? color[0] : color || '#409eff';
    this.progressCircle.setAttribute('stroke', strokeColor);

    this.circumference = 2 * Math.PI * radius;
    this.progressCircle.setAttribute('stroke-dasharray', String(this.circumference));
    this.progressCircle.style.transform = 'rotate(-90deg)';
    this.progressCircle.style.transformOrigin = 'center';

    this.svg.appendChild(this.progressCircle);

    // 创建时间文本
    this.timeText = document.createElement('div');
    this.timeText.className = 'ld-progress-countdown__time';
    this.timeText.style.position = 'absolute';
    this.timeText.style.top = '50%';
    this.timeText.style.left = '50%';
    this.timeText.style.transform = 'translate(-50%, -50%)';
    this.timeText.style.fontSize = '32px';
    this.timeText.style.fontWeight = 'bold';
    this.timeText.style.fontFamily = 'monospace';

    this.container.style.position = 'relative';
    this.container.style.display = 'inline-block';
    this.container.appendChild(this.timeText);

    // 标签文本
    if (this.config.get('showText')) {
      this.labelText = document.createElement('div');
      this.labelText.className = 'ld-progress-countdown__label';
      this.labelText.style.position = 'absolute';
      this.labelText.style.bottom = '20px';
      this.labelText.style.left = '50%';
      this.labelText.style.transform = 'translateX(-50%)';
      this.labelText.style.fontSize = '12px';
      this.labelText.style.color = '#909399';
      this.container.appendChild(this.labelText);
    }

    this.updateProgress(this.currentValue);

    if (this.config.get('autoStart')) {
      this.start();
    }
  }

  /**
   * 开始倒计时
   */
  start(): void {
    this.duration = (this.config.get('countdownDuration') ?? 60) * 1000;
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.duration - elapsed);
      const percentage = ((this.duration - remaining) / this.duration) * 100;

      this.setValue(percentage, false);

      if (remaining <= 0) {
        this.stop();
        this.emit('complete');
      }
    }, 100);
  }

  /**
   * 停止倒计时
   */
  stop(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  /**
   * 格式化时间
   */
  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const format = this.config.get('timeFormat') || 'mm:ss';

    if (format === 'mm:ss') {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else if (format === 'ss') {
      return `${totalSeconds}s`;
    } else if (format === 'mm') {
      return `${minutes}m`;
    }

    return `${totalSeconds}`;
  }

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);

    // 更新圆形进度
    const offset = this.circumference - (percentage / 100) * this.circumference;
    this.progressCircle.setAttribute('stroke-dashoffset', String(offset));

    // 更新时间显示
    const duration = (this.config.get('countdownDuration') ?? 60) * 1000;
    const remaining = duration * (1 - percentage / 100);

    if (this.timeText) {
      this.timeText.textContent = this.formatTime(remaining);
    }

    // 更新标签
    if (this.labelText) {
      if (percentage >= 100) {
        this.labelText.textContent = '时间到！';
      } else {
        this.labelText.textContent = '剩余时间';
      }
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.stop();
    super.destroy();
  }
}



