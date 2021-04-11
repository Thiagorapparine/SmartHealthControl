import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CidadesComponentsPage, CidadesDeleteDialog, CidadesUpdatePage } from './cidades.page-object';

const expect = chai.expect;

describe('Cidades e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let cidadesComponentsPage: CidadesComponentsPage;
  let cidadesUpdatePage: CidadesUpdatePage;
  let cidadesDeleteDialog: CidadesDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Cidades', async () => {
    await navBarPage.goToEntity('cidades');
    cidadesComponentsPage = new CidadesComponentsPage();
    await browser.wait(ec.visibilityOf(cidadesComponentsPage.title), 5000);
    expect(await cidadesComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.cidades.home.title');
    await browser.wait(ec.or(ec.visibilityOf(cidadesComponentsPage.entities), ec.visibilityOf(cidadesComponentsPage.noResult)), 1000);
  });

  it('should load create Cidades page', async () => {
    await cidadesComponentsPage.clickOnCreateButton();
    cidadesUpdatePage = new CidadesUpdatePage();
    expect(await cidadesUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.cidades.home.createOrEditLabel');
    await cidadesUpdatePage.cancel();
  });

  it('should create and save Cidades', async () => {
    const nbButtonsBeforeCreate = await cidadesComponentsPage.countDeleteButtons();

    await cidadesComponentsPage.clickOnCreateButton();

    await promise.all([cidadesUpdatePage.setCidadeNomeInput('cidadeNome'), cidadesUpdatePage.estadosSelectLastOption()]);

    expect(await cidadesUpdatePage.getCidadeNomeInput()).to.eq('cidadeNome', 'Expected CidadeNome value to be equals to cidadeNome');

    await cidadesUpdatePage.save();
    expect(await cidadesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await cidadesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Cidades', async () => {
    const nbButtonsBeforeDelete = await cidadesComponentsPage.countDeleteButtons();
    await cidadesComponentsPage.clickOnLastDeleteButton();

    cidadesDeleteDialog = new CidadesDeleteDialog();
    expect(await cidadesDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.cidades.delete.question');
    await cidadesDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(cidadesComponentsPage.title), 5000);

    expect(await cidadesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
