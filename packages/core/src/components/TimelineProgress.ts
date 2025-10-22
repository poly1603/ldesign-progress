import { TimelineProgressOptions, TimelineEvent } from '../types';
import { ProgressBase } from '../base';
import { createElement, createFragment, toPx, setStyles } from '../utils';

/**
 * 时间轴进度条 - 适用于历史事件、项目进度展示
 */
export class TimelineProgress extends ProgressBase<TimelineProgressOptions> {
  private wrapper!: HTMLElement;
  private timeline!: HTMLElement;
  private events: HTMLElement[] = [];
  private progressLine!: HTMLElement;

  protected getDefaultOptions(): Partial<TimelineProgressOptions> {
    return {
      ...super.getDefaultOptions(),
      layout: 'vertical',
      events: [],
      showDates: true,
      showConnector: true,
      connectorStyle: 'solid',
      eventSize: 12,
      spacing: 50,
    };
  }

  protected render(): void {
    // 清空容器
    this.container.innerHTML = '';

    const layout = this.config.get('layout') ?? 'vertical';

    // 创建包装器
    this.wrapper = createElement('div', `ld-progress-timeline ld-progress-timeline--${layout}`, this.container);

    const className = this.config.get('className');
    if (className) {
      this.wrapper.classList.add(className);
    }

    // 创建时间轴容器
    this.timeline = createElement('div', 'ld-progress-timeline__container', this.wrapper);

    // 创建进度线
    if (this.config.get('showConnector')) {
      this.progressLine = createElement('div', 'ld-progress-timeline__line', this.timeline);
      const connectorStyle = this.config.get('connectorStyle') ?? 'solid';
      this.progressLine.style.borderStyle = connectorStyle;

      const color = this.config.get('color');
      if (color) {
        const lineColor = Array.isArray(color) ? color[0] : color;
        this.progressLine.style.borderColor = lineColor;
      }
    }

    // 渲染事件
    this.renderEvents();

    // 更新进度
    this.updateProgress(this.currentValue);
  }

  /**
   * 渲染事件节点
   */
  private renderEvents(): void {
    const events = this.config.get('events') ?? [];
    const showDates = this.config.get('showDates') ?? true;
    const layout = this.config.get('layout') ?? 'vertical';
    const eventSize = this.config.get('eventSize') ?? 12;
    const spacing = this.config.get('spacing') ?? 50;

    this.events = [];

    const eventElements: HTMLElement[] = [];

    events.forEach((event, index) => {
      // 事件容器
      const eventContainer = createElement('div', 'ld-progress-timeline__event');

      if (layout === 'vertical') {
        eventContainer.style.marginTop = index === 0 ? '0' : `${spacing}px`;
      } else {
        eventContainer.style.marginLeft = index === 0 ? '0' : `${spacing}px`;
      }

      // 事件标记点
      const marker = createElement('div', 'ld-progress-timeline__marker', eventContainer);
      marker.style.width = toPx(eventSize);
      marker.style.height = toPx(eventSize);

      // 根据状态设置样式
      if (event.status === 'completed') {
        marker.classList.add('ld-progress-timeline__marker--completed');
      } else if (event.status === 'active') {
        marker.classList.add('ld-progress-timeline__marker--active');
      } else if (event.status === 'pending') {
        marker.classList.add('ld-progress-timeline__marker--pending');
      }

      // 自定义颜色
      if (event.color) {
        marker.style.backgroundColor = event.color;
        marker.style.borderColor = event.color;
      }

      // 自定义图标
      if (event.icon) {
        marker.innerHTML = event.icon;
      }

      // 事件内容
      const content = createElement('div', 'ld-progress-timeline__content', eventContainer);

      // 日期
      if (showDates && event.date) {
        const dateEl = createElement('div', 'ld-progress-timeline__date', content);
        dateEl.textContent = event.date;
      }

      // 标题
      if (event.title) {
        const titleEl = createElement('div', 'ld-progress-timeline__title', content);
        titleEl.textContent = event.title;
      }

      // 描述
      if (event.description) {
        const descEl = createElement('div', 'ld-progress-timeline__description', content);
        descEl.textContent = event.description;
      }

      // 自定义内容
      if (event.customContent) {
        const customEl = createElement('div', 'ld-progress-timeline__custom', content);
        if (typeof event.customContent === 'string') {
          customEl.innerHTML = event.customContent;
        } else {
          customEl.appendChild(event.customContent);
        }
      }

      this.events.push(eventContainer);
      eventElements.push(eventContainer);
    });

    // 批量添加到 DOM
    if (eventElements.length > 0) {
      const fragment = createFragment(eventElements);
      this.timeline.appendChild(fragment);
    }
  }

  protected updateProgress(value: number): void {
    const percentage = this.config.getPercentage(value);
    const events = this.config.get('events') ?? [];

    // 计算已完成的事件数量
    const completedCount = Math.floor((events.length * percentage) / 100);

    // 更新事件状态
    this.events.forEach((eventEl, index) => {
      const marker = eventEl.querySelector('.ld-progress-timeline__marker');
      if (!marker) return;

      marker.classList.remove(
        'ld-progress-timeline__marker--completed',
        'ld-progress-timeline__marker--active',
        'ld-progress-timeline__marker--pending'
      );

      if (index < completedCount) {
        marker.classList.add('ld-progress-timeline__marker--completed');
      } else if (index === completedCount) {
        marker.classList.add('ld-progress-timeline__marker--active');
      } else {
        marker.classList.add('ld-progress-timeline__marker--pending');
      }
    });

    // 更新进度线
    if (this.progressLine) {
      const layout = this.config.get('layout') ?? 'vertical';
      if (layout === 'vertical') {
        this.progressLine.style.height = `${percentage}%`;
      } else {
        this.progressLine.style.width = `${percentage}%`;
      }
    }
  }

  /**
   * 添加事件
   */
  addEvent(event: TimelineEvent): void {
    const events = this.config.get('events') ?? [];
    events.push(event);
    this.config.set('events', events);
    this.render();
  }

  /**
   * 移除事件
   */
  removeEvent(index: number): void {
    const events = this.config.get('events') ?? [];
    if (index >= 0 && index < events.length) {
      events.splice(index, 1);
      this.config.set('events', events);
      this.render();
    }
  }

  /**
   * 更新事件
   */
  updateEvent(index: number, event: Partial<TimelineEvent>): void {
    const events = this.config.get('events') ?? [];
    if (index >= 0 && index < events.length) {
      events[index] = { ...events[index], ...event };
      this.config.set('events', events);
      this.render();
    }
  }

  /**
   * 设置布局
   */
  setLayout(layout: 'vertical' | 'horizontal'): void {
    this.config.set('layout', layout);
    this.render();
  }
}




