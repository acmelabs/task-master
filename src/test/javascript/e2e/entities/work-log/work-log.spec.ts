/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import WorkLogComponentsPage from './work-log.page-object';
import { WorkLogDeleteDialog } from './work-log.page-object';
import WorkLogUpdatePage from './work-log-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('WorkLog e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let workLogUpdatePage: WorkLogUpdatePage;
  let workLogComponentsPage: WorkLogComponentsPage;
  let workLogDeleteDialog: WorkLogDeleteDialog;

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

  it('should load WorkLogs', async () => {
    await navBarPage.getEntityPage('work-log');
    workLogComponentsPage = new WorkLogComponentsPage();
    expect(await workLogComponentsPage.getTitle().getText()).to.match(/Work Logs/);
  });

  it('should load create WorkLog page', async () => {
    await workLogComponentsPage.clickOnCreateButton();
    workLogUpdatePage = new WorkLogUpdatePage();
    expect(await workLogUpdatePage.getPageTitle().getAttribute('id')).to.match(/taskMasterApp.workLog.home.createOrEditLabel/);
  });

  it('should create and save WorkLogs', async () => {
    const nbButtonsBeforeCreate = await workLogComponentsPage.countDeleteButtons();

    await workLogUpdatePage.setWorkDateInput('01-01-2001');
    expect(await workLogUpdatePage.getWorkDateInput()).to.eq('2001-01-01');
    await workLogUpdatePage.setQuantityInput('5');
    expect(await workLogUpdatePage.getQuantityInput()).to.eq('5');
    await workLogUpdatePage.taskSelectLastOption();
    await waitUntilDisplayed(workLogUpdatePage.getSaveButton());
    await workLogUpdatePage.save();
    await waitUntilHidden(workLogUpdatePage.getSaveButton());
    expect(await workLogUpdatePage.getSaveButton().isPresent()).to.be.false;

    await workLogComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await workLogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last WorkLog', async () => {
    await workLogComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await workLogComponentsPage.countDeleteButtons();
    await workLogComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    workLogDeleteDialog = new WorkLogDeleteDialog();
    expect(await workLogDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/taskMasterApp.workLog.delete.question/);
    await workLogDeleteDialog.clickOnConfirmButton();

    await workLogComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await workLogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
