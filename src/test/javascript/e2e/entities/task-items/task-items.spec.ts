/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TaskItemsComponentsPage from './task-items.page-object';
import { TaskItemsDeleteDialog } from './task-items.page-object';
import TaskItemsUpdatePage from './task-items-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('TaskItems e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let taskItemsUpdatePage: TaskItemsUpdatePage;
  let taskItemsComponentsPage: TaskItemsComponentsPage;
  let taskItemsDeleteDialog: TaskItemsDeleteDialog;

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

  it('should load TaskItems', async () => {
    await navBarPage.getEntityPage('task-items');
    taskItemsComponentsPage = new TaskItemsComponentsPage();
    expect(await taskItemsComponentsPage.getTitle().getText()).to.match(/Task Items/);
  });

  it('should load create TaskItems page', async () => {
    await taskItemsComponentsPage.clickOnCreateButton();
    taskItemsUpdatePage = new TaskItemsUpdatePage();
    expect(await taskItemsUpdatePage.getPageTitle().getAttribute('id')).to.match(/taskMasterApp.taskItems.home.createOrEditLabel/);
  });

  it('should create and save TaskItems', async () => {
    const nbButtonsBeforeCreate = await taskItemsComponentsPage.countDeleteButtons();

    await taskItemsUpdatePage.setNameInput('name');
    expect(await taskItemsUpdatePage.getNameInput()).to.match(/name/);
    await taskItemsUpdatePage.taskSelectLastOption();
    await waitUntilDisplayed(taskItemsUpdatePage.getSaveButton());
    await taskItemsUpdatePage.save();
    await waitUntilHidden(taskItemsUpdatePage.getSaveButton());
    expect(await taskItemsUpdatePage.getSaveButton().isPresent()).to.be.false;

    await taskItemsComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await taskItemsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last TaskItems', async () => {
    await taskItemsComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await taskItemsComponentsPage.countDeleteButtons();
    await taskItemsComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    taskItemsDeleteDialog = new TaskItemsDeleteDialog();
    expect(await taskItemsDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/taskMasterApp.taskItems.delete.question/);
    await taskItemsDeleteDialog.clickOnConfirmButton();

    await taskItemsComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await taskItemsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
