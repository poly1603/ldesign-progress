/*!
 * ***********************************
 * @ldesign/progress-core v2.0.0   *
 * Built with rollup               *
 * Build time: 2024-10-22 17:55:32 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var ProgressBase = require('../base/ProgressBase.cjs');
require('../utils/RAFController.cjs');
var helpers = require('../utils/helpers.cjs');
require('../utils/ThemeManager.cjs');
require('../utils/MemoryManager.cjs');

class MetroProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.stations = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      layout: "horizontal",
      stations: [],
      stationSize: 16,
      lineColor: "#409eff",
      spacing: 80,
      showStationNames: true
    };
  }
  render() {
    this.container.innerHTML = "";
    const layout = this.config.get("layout") ?? "horizontal";
    const stations = this.config.get("stations") || this.getDefaultStations();
    const spacing = this.config.get("spacing") ?? 80;
    const totalLength = (stations.length - 1) * spacing + 40;
    const width = layout === "horizontal" ? totalLength : 100;
    const height = layout === "horizontal" ? 100 : totalLength;
    this.wrapper = helpers.createElement("div", `ld-progress-metro ld-progress-metro--${layout}`, this.container);
    this.wrapper.style.position = "relative";
    this.wrapper.style.width = `${width}px`;
    this.wrapper.style.height = `${height}px`;
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    this.svg = helpers.createSVGElement("svg", {
      width,
      height,
      class: "ld-progress-metro__svg"
    });
    this.wrapper.appendChild(this.svg);
    this.drawLine(stations, spacing, layout);
    this.drawStations(stations, spacing, layout);
    this.updateProgress(this.currentValue);
  }
  /**
   * 获取默认站点
   */
  getDefaultStations() {
    return [
      { name: "\u8D77\u70B9", status: "completed" },
      { name: "\u7AD9\u70B91", status: "active" },
      { name: "\u7AD9\u70B92", status: "pending" },
      { name: "\u7EC8\u70B9", status: "pending" }
    ];
  }
  /**
   * 绘制线路
   */
  drawLine(stations, spacing, layout) {
    this.config.get("stationSize") ?? 16;
    const lineColor = this.config.get("lineColor") || "#409eff";
    const offset = 20;
    if (layout === "horizontal") {
      const y = 50;
      const x1 = offset;
      const x2 = offset + (stations.length - 1) * spacing;
      this.line = helpers.createSVGElement("line", {
        x1,
        y1: y,
        x2,
        y2: y,
        stroke: "#e4e7ed",
        "stroke-width": 4,
        class: "ld-progress-metro__line"
      });
      this.svg.appendChild(this.line);
      this.progressLine = helpers.createSVGElement("line", {
        x1,
        y1: y,
        x2: x1,
        y2: y,
        stroke: lineColor,
        "stroke-width": 4,
        class: "ld-progress-metro__progress-line"
      });
      this.svg.appendChild(this.progressLine);
    } else {
      const x = 50;
      const y1 = offset;
      const y2 = offset + (stations.length - 1) * spacing;
      this.line = helpers.createSVGElement("line", {
        x1: x,
        y1,
        x2: x,
        y2,
        stroke: "#e4e7ed",
        "stroke-width": 4,
        class: "ld-progress-metro__line"
      });
      this.svg.appendChild(this.line);
      this.progressLine = helpers.createSVGElement("line", {
        x1: x,
        y1,
        x2: x,
        y2: y1,
        stroke: lineColor,
        "stroke-width": 4,
        class: "ld-progress-metro__progress-line"
      });
      this.svg.appendChild(this.progressLine);
    }
  }
  /**
   * 绘制站点
   */
  drawStations(stations, spacing, layout) {
    const stationSize = this.config.get("stationSize") ?? 16;
    const showNames = this.config.get("showStationNames") ?? true;
    const offset = 20;
    this.stations = [];
    const stationElements = [];
    stations.forEach((station, index) => {
      const x = layout === "horizontal" ? offset + index * spacing : 50;
      const y = layout === "horizontal" ? 50 : offset + index * spacing;
      const circle = helpers.createSVGElement("circle", {
        cx: x,
        cy: y,
        r: stationSize / 2,
        fill: "white",
        stroke: "#e4e7ed",
        "stroke-width": 3,
        class: "ld-progress-metro__station"
      });
      this.svg.appendChild(circle);
      if (showNames && station.name) {
        const label = helpers.createElement("div", "ld-progress-metro__label");
        label.textContent = station.name;
        label.style.position = "absolute";
        label.style.fontSize = "12px";
        label.style.color = "#606266";
        label.style.whiteSpace = "nowrap";
        if (layout === "horizontal") {
          label.style.left = `${x}px`;
          label.style.top = "70px";
          label.style.transform = "translateX(-50%)";
        } else {
          label.style.left = "70px";
          label.style.top = `${y}px`;
          label.style.transform = "translateY(-50%)";
        }
        stationElements.push(label);
        this.stations.push(label);
      }
    });
    if (stationElements.length > 0) {
      const fragment = helpers.createFragment(stationElements);
      this.wrapper.appendChild(fragment);
    }
  }
  updateProgress(value) {
    const percentage = this.config.getPercentage(value);
    const stations = this.config.get("stations") || this.getDefaultStations();
    const spacing = this.config.get("spacing") ?? 80;
    const layout = this.config.get("layout") ?? "horizontal";
    const offset = 20;
    const lineColor = this.config.get("lineColor") || "#409eff";
    const totalLength = (stations.length - 1) * spacing;
    const progressLength = totalLength * percentage / 100;
    if (layout === "horizontal") {
      this.progressLine.setAttribute("x2", String(offset + progressLength));
    } else {
      this.progressLine.setAttribute("y2", String(offset + progressLength));
    }
    const reachedStations = Math.floor(stations.length * percentage / 100);
    const circles = this.svg.querySelectorAll(".ld-progress-metro__station");
    circles.forEach((circle, index) => {
      if (index < reachedStations) {
        circle.setAttribute("fill", lineColor);
        circle.setAttribute("stroke", lineColor);
      } else if (index === reachedStations) {
        circle.setAttribute("fill", "white");
        circle.setAttribute("stroke", lineColor);
      } else {
        circle.setAttribute("fill", "white");
        circle.setAttribute("stroke", "#e4e7ed");
      }
    });
  }
  /**
   * 生成螺旋路径
   */
  generateSpiralPath(cx, cy, innerRadius, outerRadius, turns, clockwise) {
    const points = turns * 50;
    const radiusStep = (outerRadius - innerRadius) / points;
    const angleStep = turns * 2 * Math.PI / points;
    const direction = clockwise ? 1 : -1;
    let path = "";
    for (let i = 0; i <= points; i++) {
      const radius = innerRadius + i * radiusStep;
      const angle = i * angleStep * direction;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    return path;
  }
  /**
   * 设置站点
   */
  setStations(stations) {
    this.config.set("stations", stations);
    this.render();
  }
}

exports.MetroProgress = MetroProgress;
//# sourceMappingURL=MetroProgress.cjs.map
