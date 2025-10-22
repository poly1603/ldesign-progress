/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ProgressBase } from '../base/ProgressBase.js';
import '../utils/RAFController.js';
import { createElement, toPx, createFragment } from '../utils/helpers.js';
import '../utils/ThemeManager.js';
import '../utils/MemoryManager.js';

class TimelineProgress extends ProgressBase {
  constructor() {
    super(...arguments);
    this.events = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      layout: "vertical",
      events: [],
      showDates: true,
      showConnector: true,
      connectorStyle: "solid",
      eventSize: 12,
      spacing: 50
    };
  }
  render() {
    this.container.innerHTML = "";
    const layout = this.config.get("layout") ?? "vertical";
    this.wrapper = createElement("div", `ld-progress-timeline ld-progress-timeline--${layout}`, this.container);
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.timeline = createElement("div", "ld-progress-timeline__container", this.wrapper);
    if (this.config.get("showConnector")) {
      this.progressLine = createElement("div", "ld-progress-timeline__line", this.timeline);
      const connectorStyle = this.config.get("connectorStyle") ?? "solid";
      this.progressLine.style.borderStyle = connectorStyle;
      const color = this.config.get("color");
      if (color) {
        const lineColor = Array.isArray(color) ? color[0] : color;
        this.progressLine.style.borderColor = lineColor;
      }
    }
    this.renderEvents();
    this.updateProgress(this.currentValue);
  }
  /**
   * 渲染事件节点
   */
  renderEvents() {
    const events = this.config.get("events") ?? [];
    const showDates = this.config.get("showDates") ?? true;
    const layout = this.config.get("layout") ?? "vertical";
    const eventSize = this.config.get("eventSize") ?? 12;
    const spacing = this.config.get("spacing") ?? 50;
    this.events = [];
    const eventElements = [];
    events.forEach((event, index) => {
      const eventContainer = createElement("div", "ld-progress-timeline__event");
      if (layout === "vertical") {
        eventContainer.style.marginTop = index === 0 ? "0" : `${spacing}px`;
      } else {
        eventContainer.style.marginLeft = index === 0 ? "0" : `${spacing}px`;
      }
      const marker = createElement("div", "ld-progress-timeline__marker", eventContainer);
      marker.style.width = toPx(eventSize);
      marker.style.height = toPx(eventSize);
      if (event.status === "completed") {
        marker.classList.add("ld-progress-timeline__marker--completed");
      } else if (event.status === "active") {
        marker.classList.add("ld-progress-timeline__marker--active");
      } else if (event.status === "pending") {
        marker.classList.add("ld-progress-timeline__marker--pending");
      }
      if (event.color) {
        marker.style.backgroundColor = event.color;
        marker.style.borderColor = event.color;
      }
      if (event.icon) {
        marker.innerHTML = event.icon;
      }
      const content = createElement("div", "ld-progress-timeline__content", eventContainer);
      if (showDates && event.date) {
        const dateEl = createElement("div", "ld-progress-timeline__date", content);
        dateEl.textContent = event.date;
      }
      if (event.title) {
        const titleEl = createElement("div", "ld-progress-timeline__title", content);
        titleEl.textContent = event.title;
      }
      if (event.description) {
        const descEl = createElement("div", "ld-progress-timeline__description", content);
        descEl.textContent = event.description;
      }
      if (event.customContent) {
        const customEl = createElement("div", "ld-progress-timeline__custom", content);
        if (typeof event.customContent === "string") {
          customEl.innerHTML = event.customContent;
        } else {
          customEl.appendChild(event.customContent);
        }
      }
      this.events.push(eventContainer);
      eventElements.push(eventContainer);
    });
    if (eventElements.length > 0) {
      const fragment = createFragment(eventElements);
      this.timeline.appendChild(fragment);
    }
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const events = this.config.get("events") ?? [];
    const completedCount = Math.floor(events.length * percentage / 100);
    this.events.forEach((eventEl, index) => {
      const marker = eventEl.querySelector(".ld-progress-timeline__marker");
      if (!marker)
        return;
      marker.classList.remove(
        "ld-progress-timeline__marker--completed",
        "ld-progress-timeline__marker--active",
        "ld-progress-timeline__marker--pending"
      );
      if (index < completedCount) {
        marker.classList.add("ld-progress-timeline__marker--completed");
      } else if (index === completedCount) {
        marker.classList.add("ld-progress-timeline__marker--active");
      } else {
        marker.classList.add("ld-progress-timeline__marker--pending");
      }
    });
    if (this.progressLine) {
      const layout = this.config.get("layout") ?? "vertical";
      if (layout === "vertical") {
        this.progressLine.style.height = `${percentage}%`;
      } else {
        this.progressLine.style.width = `${percentage}%`;
      }
    }
  }
  /**
   * 添加事件
   */
  addEvent(event) {
    const events = this.config.get("events") ?? [];
    events.push(event);
    this.config.set("events", events);
    this.render();
  }
  /**
   * 移除事件
   */
  removeEvent(index) {
    const events = this.config.get("events") ?? [];
    if (index >= 0 && index < events.length) {
      events.splice(index, 1);
      this.config.set("events", events);
      this.render();
    }
  }
  /**
   * 更新事件
   */
  updateEvent(index, event) {
    const events = this.config.get("events") ?? [];
    if (index >= 0 && index < events.length) {
      events[index] = { ...events[index], ...event };
      this.config.set("events", events);
      this.render();
    }
  }
  /**
   * 设置布局
   */
  setLayout(layout) {
    this.config.set("layout", layout);
    this.render();
  }
}

export { TimelineProgress };
//# sourceMappingURL=TimelineProgress.js.map
