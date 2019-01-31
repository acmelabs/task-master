import { element, by, ElementFinder } from 'protractor';

export default class TaskUpdatePage {
  pageTitle: ElementFinder = element(by.id('taskMasterApp.task.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  taskNameInput: ElementFinder = element(by.css('input#task-taskName'));
  prioritySelect: ElementFinder = element(by.css('select#task-priority'));
  dueDateInput: ElementFinder = element(by.css('input#task-dueDate'));
  statusSelect: ElementFinder = element(by.css('select#task-status'));
  taskTypeSelect: ElementFinder = element(by.css('select#task-taskType'));
  quantityTypeSelect: ElementFinder = element(by.css('select#task-quantityType'));
  estimatedQuantityInput: ElementFinder = element(by.css('input#task-estimatedQuantity'));
  noteInput: ElementFinder = element(by.css('input#task-note'));
  orderInput: ElementFinder = element(by.css('input#task-order'));
  projectSelect: ElementFinder = element(by.css('select#task-project'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTaskNameInput(taskName) {
    await this.taskNameInput.sendKeys(taskName);
  }

  async getTaskNameInput() {
    return this.taskNameInput.getAttribute('value');
  }

  async setPrioritySelect(priority) {
    await this.prioritySelect.sendKeys(priority);
  }

  async getPrioritySelect() {
    return this.prioritySelect.element(by.css('option:checked')).getText();
  }

  async prioritySelectLastOption() {
    await this.prioritySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setDueDateInput(dueDate) {
    await this.dueDateInput.sendKeys(dueDate);
  }

  async getDueDateInput() {
    return this.dueDateInput.getAttribute('value');
  }

  async setStatusSelect(status) {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect() {
    return this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption() {
    await this.statusSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setTaskTypeSelect(taskType) {
    await this.taskTypeSelect.sendKeys(taskType);
  }

  async getTaskTypeSelect() {
    return this.taskTypeSelect.element(by.css('option:checked')).getText();
  }

  async taskTypeSelectLastOption() {
    await this.taskTypeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setQuantityTypeSelect(quantityType) {
    await this.quantityTypeSelect.sendKeys(quantityType);
  }

  async getQuantityTypeSelect() {
    return this.quantityTypeSelect.element(by.css('option:checked')).getText();
  }

  async quantityTypeSelectLastOption() {
    await this.quantityTypeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setEstimatedQuantityInput(estimatedQuantity) {
    await this.estimatedQuantityInput.sendKeys(estimatedQuantity);
  }

  async getEstimatedQuantityInput() {
    return this.estimatedQuantityInput.getAttribute('value');
  }

  async setNoteInput(note) {
    await this.noteInput.sendKeys(note);
  }

  async getNoteInput() {
    return this.noteInput.getAttribute('value');
  }

  async setOrderInput(order) {
    await this.orderInput.sendKeys(order);
  }

  async getOrderInput() {
    return this.orderInput.getAttribute('value');
  }

  async projectSelectLastOption() {
    await this.projectSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async projectSelectOption(option) {
    await this.projectSelect.sendKeys(option);
  }

  getProjectSelect() {
    return this.projectSelect;
  }

  async getProjectSelectedOption() {
    return this.projectSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
