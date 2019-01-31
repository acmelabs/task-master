/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ProjectComponentsPage from './project.page-object';
import { ProjectDeleteDialog } from './project.page-object';
import ProjectUpdatePage from './project-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Project e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let projectUpdatePage: ProjectUpdatePage;
  let projectComponentsPage: ProjectComponentsPage;
  let projectDeleteDialog: ProjectDeleteDialog;

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

  it('should load Projects', async () => {
    await navBarPage.getEntityPage('project');
    projectComponentsPage = new ProjectComponentsPage();
    expect(await projectComponentsPage.getTitle().getText()).to.match(/Projects/);
  });

  it('should load create Project page', async () => {
    await projectComponentsPage.clickOnCreateButton();
    projectUpdatePage = new ProjectUpdatePage();
    expect(await projectUpdatePage.getPageTitle().getAttribute('id')).to.match(/taskMasterApp.project.home.createOrEditLabel/);
  });

  it('should create and save Projects', async () => {
    const nbButtonsBeforeCreate = await projectComponentsPage.countDeleteButtons();

    await projectUpdatePage.setNameInput('name');
    expect(await projectUpdatePage.getNameInput()).to.match(/name/);
    await projectUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(projectUpdatePage.getSaveButton());
    await projectUpdatePage.save();
    await waitUntilHidden(projectUpdatePage.getSaveButton());
    expect(await projectUpdatePage.getSaveButton().isPresent()).to.be.false;

    await projectComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await projectComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Project', async () => {
    await projectComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await projectComponentsPage.countDeleteButtons();
    await projectComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    projectDeleteDialog = new ProjectDeleteDialog();
    expect(await projectDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/taskMasterApp.project.delete.question/);
    await projectDeleteDialog.clickOnConfirmButton();

    await projectComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await projectComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
