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

class StepProgress extends ProgressBase.ProgressBase {
  constructor() {
    super(...arguments);
    this.stepElements = [];
    this.lineElements = [];
  }
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      steps: [],
      currentStep: 0,
      layout: "horizontal",
      showDescription: true
    };
  }
  render() {
    this.container.innerHTML = "";
    const layout = this.config.get("layout") ?? "horizontal";
    this.wrapper = helpers.createElement("div", "ld-progress-step", this.container);
    this.wrapper.classList.add(`ld-progress-step--${layout}`);
    const className = this.config.get("className");
    if (className) {
      this.wrapper.classList.add(className);
    }
    const steps = this.config.get("steps") ?? [];
    this.stepElements = [];
    this.lineElements = [];
    steps.forEach((step, index) => {
      const stepItem = helpers.createElement("div", "ld-progress-step__item", this.wrapper);
      const stepHead = helpers.createElement("div", "ld-progress-step__head", stepItem);
      const stepIcon = helpers.createElement("div", "ld-progress-step__icon", stepHead);
      if (step.icon) {
        stepIcon.innerHTML = step.icon;
      } else {
        stepIcon.textContent = `${index + 1}`;
      }
      const stepMain = helpers.createElement("div", "ld-progress-step__main", stepItem);
      if (step.title) {
        const stepTitle = helpers.createElement("div", "ld-progress-step__title", stepMain);
        stepTitle.textContent = step.title;
      }
      if (step.description && this.config.get("showDescription")) {
        const stepDesc = helpers.createElement("div", "ld-progress-step__description", stepMain);
        stepDesc.textContent = step.description;
      }
      const status = step.status || this.getStepStatus(index);
      stepItem.classList.add(`ld-progress-step__item--${status}`);
      this.stepElements.push(stepItem);
      if (index < steps.length - 1) {
        const line = helpers.createElement("div", "ld-progress-step__line", stepHead);
        line.classList.add(`ld-progress-step__line--${status}`);
        this.lineElements.push(line);
      }
    });
    this.updateProgress(this.currentValue);
  }
  updateProgress(value) {
    const steps = this.config.get("steps") ?? [];
    const currentStep = this.config.get("currentStep") ?? 0;
    this.stepElements.forEach((stepElement, index) => {
      stepElement.classList.remove(
        "ld-progress-step__item--completed",
        "ld-progress-step__item--active",
        "ld-progress-step__item--pending",
        "ld-progress-step__item--error"
      );
      const step = steps[index];
      const status = step?.status || this.getStepStatus(index);
      stepElement.classList.add(`ld-progress-step__item--${status}`);
    });
    this.lineElements.forEach((line, index) => {
      line.classList.remove(
        "ld-progress-step__line--completed",
        "ld-progress-step__line--active",
        "ld-progress-step__line--pending"
      );
      const status = index < currentStep ? "completed" : "pending";
      line.classList.add(`ld-progress-step__line--${status}`);
    });
  }
  /**
   * 根据当前步骤获取状态
   */
  getStepStatus(index) {
    const currentStep = this.config.get("currentStep") ?? 0;
    if (index < currentStep) {
      return "completed";
    } else if (index === currentStep) {
      return "active";
    } else {
      return "pending";
    }
  }
  /**
   * 设置当前步骤
   */
  setCurrentStep(step) {
    const steps = this.config.get("steps") ?? [];
    const normalizedStep = Math.max(0, Math.min(steps.length - 1, step));
    this.config.set("currentStep", normalizedStep);
    this.currentValue = normalizedStep;
    this.updateProgress(normalizedStep);
    this.emit("change", normalizedStep);
    if (normalizedStep >= steps.length - 1) {
      this.emit("complete");
    }
  }
  /**
   * 下一步
   */
  next() {
    const currentStep = this.config.get("currentStep") ?? 0;
    this.setCurrentStep(currentStep + 1);
  }
  /**
   * 上一步
   */
  prev() {
    const currentStep = this.config.get("currentStep") ?? 0;
    this.setCurrentStep(currentStep - 1);
  }
  /**
   * 设置步骤状态
   */
  setStepStatus(index, status) {
    const steps = this.config.get("steps") ?? [];
    if (index >= 0 && index < steps.length) {
      steps[index].status = status;
      this.updateProgress(this.currentValue);
    }
  }
  /**
   * 添加步骤
   */
  addStep(step) {
    const steps = this.config.get("steps") ?? [];
    steps.push(step);
    this.config.set("steps", steps);
    this.render();
  }
  /**
   * 移除步骤
   */
  removeStep(index) {
    const steps = this.config.get("steps") ?? [];
    if (index >= 0 && index < steps.length) {
      steps.splice(index, 1);
      this.config.set("steps", steps);
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

exports.StepProgress = StepProgress;
//# sourceMappingURL=StepProgress.cjs.map
