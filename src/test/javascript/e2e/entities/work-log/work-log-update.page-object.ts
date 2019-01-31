import { element, by, ElementFinder } from 'protractor';

export default class WorkLogUpdatePage {
  pageTitle: ElementFinder = element(by.id('taskMasterApp.workLog.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  workDateInput: ElementFinder = element(by.css('input#work-log-workDate'));
  quantityInput: ElementFinder = element(by.css('input#work-log-quantity'));
  taskSelect: ElementFinder = element(by.css('select#work-log-task'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setWorkDateInput(workDate) {
    await this.workDateInput.sendKeys(workDate);
  }

  async getWorkDateInput() {
    return this.workDateInput.getAttribute('value');
  }

  async setQuantityInput(quantity) {
    await this.quantityInput.sendKeys(quantity);
  }

  async getQuantityInput() {
    return this.quantityInput.getAttribute('value');
  }

  async taskSelectLastOption() {
    await this.taskSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async taskSelectOption(option) {
    await this.taskSelect.sendKeys(option);
  }

  getTaskSelect() {
    return this.taskSelect;
  }

  async getTaskSelectedOption() {
    return this.taskSelect.element(by.css('option:checked')).getText();
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
