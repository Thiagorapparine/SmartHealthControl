import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EntidadeSaudeComponentsPage, EntidadeSaudeDeleteDialog, EntidadeSaudeUpdatePage } from './entidade-saude.page-object';

const expect = chai.expect;

describe('EntidadeSaude e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let entidadeSaudeComponentsPage: EntidadeSaudeComponentsPage;
  let entidadeSaudeUpdatePage: EntidadeSaudeUpdatePage;
  let entidadeSaudeDeleteDialog: EntidadeSaudeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load EntidadeSaudes', async () => {
    await navBarPage.goToEntity('entidade-saude');
    entidadeSaudeComponentsPage = new EntidadeSaudeComponentsPage();
    await browser.wait(ec.visibilityOf(entidadeSaudeComponentsPage.title), 5000);
    expect(await entidadeSaudeComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.entidadeSaude.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(entidadeSaudeComponentsPage.entities), ec.visibilityOf(entidadeSaudeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create EntidadeSaude page', async () => {
    await entidadeSaudeComponentsPage.clickOnCreateButton();
    entidadeSaudeUpdatePage = new EntidadeSaudeUpdatePage();
    expect(await entidadeSaudeUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.entidadeSaude.home.createOrEditLabel');
    await entidadeSaudeUpdatePage.cancel();
  });

  it('should create and save EntidadeSaudes', async () => {
    const nbButtonsBeforeCreate = await entidadeSaudeComponentsPage.countDeleteButtons();

    await entidadeSaudeComponentsPage.clickOnCreateButton();

    await promise.all([
      entidadeSaudeUpdatePage.setEntidadeNomeInput('entidadeNome'),
      entidadeSaudeUpdatePage.entidadeSetorSelectLastOption(),
      entidadeSaudeUpdatePage.setEntidadeEnderecoInput('entidadeEndereco'),
      entidadeSaudeUpdatePage.saudeTipoSelectLastOption(),
      entidadeSaudeUpdatePage.estadosSelectLastOption(),
      entidadeSaudeUpdatePage.cidadesSelectLastOption(),
      // entidadeSaudeUpdatePage.tiposProcedimentoSelectLastOption(),
      // entidadeSaudeUpdatePage.profissionaisSelectLastOption(),
    ]);

    expect(await entidadeSaudeUpdatePage.getEntidadeNomeInput()).to.eq(
      'entidadeNome',
      'Expected EntidadeNome value to be equals to entidadeNome'
    );
    expect(await entidadeSaudeUpdatePage.getEntidadeEnderecoInput()).to.eq(
      'entidadeEndereco',
      'Expected EntidadeEndereco value to be equals to entidadeEndereco'
    );

    await entidadeSaudeUpdatePage.save();
    expect(await entidadeSaudeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await entidadeSaudeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last EntidadeSaude', async () => {
    const nbButtonsBeforeDelete = await entidadeSaudeComponentsPage.countDeleteButtons();
    await entidadeSaudeComponentsPage.clickOnLastDeleteButton();

    entidadeSaudeDeleteDialog = new EntidadeSaudeDeleteDialog();
    expect(await entidadeSaudeDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.entidadeSaude.delete.question');
    await entidadeSaudeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(entidadeSaudeComponentsPage.title), 5000);

    expect(await entidadeSaudeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
