import { element, by, ElementFinder } from 'protractor';

export default class ReminderUpdatePage {
  pageTitle: ElementFinder = element(by.id('taskMasterApp.reminder.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  reminderDateInput: ElementFinder = element(by.css('input#reminder-reminderDate'));
  taskSelect: ElementFinder = element(by.css('select#reminder-task'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setReminderDateInput(reminderDate) {
    await this.reminderDateInput.sendKeys(reminderDate);
  }

  async getReminderDateInput() {
    return this.reminderDateInput.getAttribute('value');
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
