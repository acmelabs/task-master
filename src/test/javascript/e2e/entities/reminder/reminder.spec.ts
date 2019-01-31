/* tslint:disable no-unused-expression */
import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ReminderComponentsPage from './reminder.page-object';
import { ReminderDeleteDialog } from './reminder.page-object';
import ReminderUpdatePage from './reminder-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Reminder e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let reminderUpdatePage: ReminderUpdatePage;
  let reminderComponentsPage: ReminderComponentsPage;
  let reminderDeleteDialog: ReminderDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();

    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load Reminders', async () => {
    await navBarPage.getEntityPage('reminder');
    reminderComponentsPage = new ReminderComponentsPage();
    expect(await reminderComponentsPage.getTitle().getText()).to.match(/Reminders/);
  });

  it('should load create Reminder page', async () => {
    await reminderComponentsPage.clickOnCreateButton();
    reminderUpdatePage = new ReminderUpdatePage();
    expect(await reminderUpdatePage.getPageTitle().getAttribute('id')).to.match(/taskMasterApp.reminder.home.createOrEditLabel/);
  });

  it('should create and save Reminders', async () => {
    const nbButtonsBeforeCreate = await reminderComponentsPage.countDeleteButtons();

    await reminderUpdatePage.setReminderDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await reminderUpdatePage.getReminderDateInput()).to.contain('2001-01-01T02:30');
    await reminderUpdatePage.taskSelectLastOption();
    await waitUntilDisplayed(reminderUpdatePage.getSaveButton());
    await reminderUpdatePage.save();
    await waitUntilHidden(reminderUpdatePage.getSaveButton());
    expect(await reminderUpdatePage.getSaveButton().isPresent()).to.be.false;

    await reminderComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await reminderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Reminder', async () => {
    await reminderComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await reminderComponentsPage.countDeleteButtons();
    await reminderComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    reminderDeleteDialog = new ReminderDeleteDialog();
    expect(await reminderDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/taskMasterApp.reminder.delete.question/);
    await reminderDeleteDialog.clickOnConfirmButton();

    await reminderComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await reminderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
