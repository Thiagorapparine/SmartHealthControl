import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SaudeTipoComponentsPage, SaudeTipoDeleteDialog, SaudeTipoUpdatePage } from './saude-tipo.page-object';

const expect = chai.expect;

describe('SaudeTipo e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let saudeTipoComponentsPage: SaudeTipoComponentsPage;
  let saudeTipoUpdatePage: SaudeTipoUpdatePage;
  let saudeTipoDeleteDialog: SaudeTipoDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load SaudeTipos', async () => {
    await navBarPage.goToEntity('saude-tipo');
    saudeTipoComponentsPage = new SaudeTipoComponentsPage();
    await browser.wait(ec.visibilityOf(saudeTipoComponentsPage.title), 5000);
    expect(await saudeTipoComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.saudeTipo.home.title');
    await browser.wait(ec.or(ec.visibilityOf(saudeTipoComponentsPage.entities), ec.visibilityOf(saudeTipoComponentsPage.noResult)), 1000);
  });

  it('should load create SaudeTipo page', async () => {
    await saudeTipoComponentsPage.clickOnCreateButton();
    saudeTipoUpdatePage = new SaudeTipoUpdatePage();
    expect(await saudeTipoUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.saudeTipo.home.createOrEditLabel');
    await saudeTipoUpdatePage.cancel();
  });

  it('should create and save SaudeTipos', async () => {
    const nbButtonsBeforeCreate = await saudeTipoComponentsPage.countDeleteButtons();

    await saudeTipoComponentsPage.clickOnCreateButton();

    await promise.all([
      saudeTipoUpdatePage.setTipoIdentificacaoInput('tipoIdentificacao'),
      saudeTipoUpdatePage.setTipoDescricaoInput('tipoDescricao'),
    ]);

    expect(await saudeTipoUpdatePage.getTipoIdentificacaoInput()).to.eq(
      'tipoIdentificacao',
      'Expected TipoIdentificacao value to be equals to tipoIdentificacao'
    );
    expect(await saudeTipoUpdatePage.getTipoDescricaoInput()).to.eq(
      'tipoDescricao',
      'Expected TipoDescricao value to be equals to tipoDescricao'
    );

    await saudeTipoUpdatePage.save();
    expect(await saudeTipoUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await saudeTipoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last SaudeTipo', async () => {
    const nbButtonsBeforeDelete = await saudeTipoComponentsPage.countDeleteButtons();
    await saudeTipoComponentsPage.clickOnLastDeleteButton();

    saudeTipoDeleteDialog = new SaudeTipoDeleteDialog();
    expect(await saudeTipoDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.saudeTipo.delete.question');
    await saudeTipoDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(saudeTipoComponentsPage.title), 5000);

    expect(await saudeTipoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
