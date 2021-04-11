import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SetorSaudeComponentsPage, SetorSaudeDeleteDialog, SetorSaudeUpdatePage } from './setor-saude.page-object';

const expect = chai.expect;

describe('SetorSaude e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let setorSaudeComponentsPage: SetorSaudeComponentsPage;
  let setorSaudeUpdatePage: SetorSaudeUpdatePage;
  let setorSaudeDeleteDialog: SetorSaudeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load SetorSaudes', async () => {
    await navBarPage.goToEntity('setor-saude');
    setorSaudeComponentsPage = new SetorSaudeComponentsPage();
    await browser.wait(ec.visibilityOf(setorSaudeComponentsPage.title), 5000);
    expect(await setorSaudeComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.setorSaude.home.title');
    await browser.wait(ec.or(ec.visibilityOf(setorSaudeComponentsPage.entities), ec.visibilityOf(setorSaudeComponentsPage.noResult)), 1000);
  });

  it('should load create SetorSaude page', async () => {
    await setorSaudeComponentsPage.clickOnCreateButton();
    setorSaudeUpdatePage = new SetorSaudeUpdatePage();
    expect(await setorSaudeUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.setorSaude.home.createOrEditLabel');
    await setorSaudeUpdatePage.cancel();
  });

  it('should create and save SetorSaudes', async () => {
    const nbButtonsBeforeCreate = await setorSaudeComponentsPage.countDeleteButtons();

    await setorSaudeComponentsPage.clickOnCreateButton();

    await promise.all([setorSaudeUpdatePage.setSetorSaudeInput('setorSaude')]);

    expect(await setorSaudeUpdatePage.getSetorSaudeInput()).to.eq('setorSaude', 'Expected SetorSaude value to be equals to setorSaude');

    await setorSaudeUpdatePage.save();
    expect(await setorSaudeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await setorSaudeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last SetorSaude', async () => {
    const nbButtonsBeforeDelete = await setorSaudeComponentsPage.countDeleteButtons();
    await setorSaudeComponentsPage.clickOnLastDeleteButton();

    setorSaudeDeleteDialog = new SetorSaudeDeleteDialog();
    expect(await setorSaudeDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.setorSaude.delete.question');
    await setorSaudeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(setorSaudeComponentsPage.title), 5000);

    expect(await setorSaudeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
