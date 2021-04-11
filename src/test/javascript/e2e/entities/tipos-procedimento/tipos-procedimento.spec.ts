import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  TiposProcedimentoComponentsPage,
  TiposProcedimentoDeleteDialog,
  TiposProcedimentoUpdatePage,
} from './tipos-procedimento.page-object';

const expect = chai.expect;

describe('TiposProcedimento e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let tiposProcedimentoComponentsPage: TiposProcedimentoComponentsPage;
  let tiposProcedimentoUpdatePage: TiposProcedimentoUpdatePage;
  let tiposProcedimentoDeleteDialog: TiposProcedimentoDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load TiposProcedimentos', async () => {
    await navBarPage.goToEntity('tipos-procedimento');
    tiposProcedimentoComponentsPage = new TiposProcedimentoComponentsPage();
    await browser.wait(ec.visibilityOf(tiposProcedimentoComponentsPage.title), 5000);
    expect(await tiposProcedimentoComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.tiposProcedimento.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(tiposProcedimentoComponentsPage.entities), ec.visibilityOf(tiposProcedimentoComponentsPage.noResult)),
      1000
    );
  });

  it('should load create TiposProcedimento page', async () => {
    await tiposProcedimentoComponentsPage.clickOnCreateButton();
    tiposProcedimentoUpdatePage = new TiposProcedimentoUpdatePage();
    expect(await tiposProcedimentoUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.tiposProcedimento.home.createOrEditLabel');
    await tiposProcedimentoUpdatePage.cancel();
  });

  it('should create and save TiposProcedimentos', async () => {
    const nbButtonsBeforeCreate = await tiposProcedimentoComponentsPage.countDeleteButtons();

    await tiposProcedimentoComponentsPage.clickOnCreateButton();

    await promise.all([
      tiposProcedimentoUpdatePage.setProcedimentoNomeInput('procedimentoNome'),
      tiposProcedimentoUpdatePage.setProcedimentoDescricaoInput('procedimentoDescricao'),
      tiposProcedimentoUpdatePage.setorSaudeSelectLastOption(),
    ]);

    expect(await tiposProcedimentoUpdatePage.getProcedimentoNomeInput()).to.eq(
      'procedimentoNome',
      'Expected ProcedimentoNome value to be equals to procedimentoNome'
    );
    expect(await tiposProcedimentoUpdatePage.getProcedimentoDescricaoInput()).to.eq(
      'procedimentoDescricao',
      'Expected ProcedimentoDescricao value to be equals to procedimentoDescricao'
    );

    await tiposProcedimentoUpdatePage.save();
    expect(await tiposProcedimentoUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await tiposProcedimentoComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last TiposProcedimento', async () => {
    const nbButtonsBeforeDelete = await tiposProcedimentoComponentsPage.countDeleteButtons();
    await tiposProcedimentoComponentsPage.clickOnLastDeleteButton();

    tiposProcedimentoDeleteDialog = new TiposProcedimentoDeleteDialog();
    expect(await tiposProcedimentoDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.tiposProcedimento.delete.question');
    await tiposProcedimentoDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(tiposProcedimentoComponentsPage.title), 5000);

    expect(await tiposProcedimentoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
