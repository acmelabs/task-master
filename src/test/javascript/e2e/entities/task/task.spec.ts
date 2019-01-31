/* tslint:disable no-unused-expression */
import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TaskComponentsPage from './task.page-object';
import { TaskDeleteDialog } from './task.page-object';
import TaskUpdatePage from './task-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Task e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let taskUpdatePage: TaskUpdatePage;
  let taskComponentsPage: TaskComponentsPage;
  let taskDeleteDialog: TaskDeleteDialog;

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

  it('should load Tasks', async () => {
    await navBarPage.getEntityPage('task');
    taskComponentsPage = new TaskComponentsPage();
    expect(await taskComponentsPage.getTitle().getText()).to.match(/Tasks/);
  });

  it('should load create Task page', async () => {
    await taskComponentsPage.clickOnCreateButton();
    taskUpdatePage = new TaskUpdatePage();
    expect(await taskUpdatePage.getPageTitle().getAttribute('id')).to.match(/taskMasterApp.task.home.createOrEditLabel/);
  });

  it('should create and save Tasks', async () => {
    const nbButtonsBeforeCreate = await taskComponentsPage.countDeleteButtons();

    await taskUpdatePage.setTaskNameInput('taskName');
    expect(await taskUpdatePage.getTaskNameInput()).to.match(/taskName/);
    await taskUpdatePage.prioritySelectLastOption();
    await taskUpdatePage.setDueDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await taskUpdatePage.getDueDateInput()).to.contain('2001-01-01T02:30');
    await taskUpdatePage.statusSelectLastOption();
    await taskUpdatePage.taskTypeSelectLastOption();
    await taskUpdatePage.quantityTypeSelectLastOption();
    await taskUpdatePage.setEstimatedQuantityInput('5');
    expect(await taskUpdatePage.getEstimatedQuantityInput()).to.eq('5');
    await taskUpdatePage.setNoteInput('note');
    expect(await taskUpdatePage.getNoteInput()).to.match(/note/);
    await taskUpdatePage.setOrderInput('5');
    expect(await taskUpdatePage.getOrderInput()).to.eq('5');
    await taskUpdatePage.projectSelectLastOption();
    await waitUntilDisplayed(taskUpdatePage.getSaveButton());
    await taskUpdatePage.save();
    await waitUntilHidden(taskUpdatePage.getSaveButton());
    expect(await taskUpdatePage.getSaveButton().isPresent()).to.be.false;

    await taskComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await taskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Task', async () => {
    await taskComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await taskComponentsPage.countDeleteButtons();
    await taskComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    taskDeleteDialog = new TaskDeleteDialog();
    expect(await taskDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/taskMasterApp.task.delete.question/);
    await taskDeleteDialog.clickOnConfirmButton();

    await taskComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await taskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
