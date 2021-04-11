import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ExamesAgendaComponentsPage, ExamesAgendaDeleteDialog, ExamesAgendaUpdatePage } from './exames-agenda.page-object';

const expect = chai.expect;

describe('ExamesAgenda e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let examesAgendaComponentsPage: ExamesAgendaComponentsPage;
  let examesAgendaUpdatePage: ExamesAgendaUpdatePage;
  let examesAgendaDeleteDialog: ExamesAgendaDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ExamesAgenda', async () => {
    await navBarPage.goToEntity('exames-agenda');
    examesAgendaComponentsPage = new ExamesAgendaComponentsPage();
    await browser.wait(ec.visibilityOf(examesAgendaComponentsPage.title), 5000);
    expect(await examesAgendaComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.examesAgenda.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(examesAgendaComponentsPage.entities), ec.visibilityOf(examesAgendaComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ExamesAgenda page', async () => {
    await examesAgendaComponentsPage.clickOnCreateButton();
    examesAgendaUpdatePage = new ExamesAgendaUpdatePage();
    expect(await examesAgendaUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.examesAgenda.home.createOrEditLabel');
    await examesAgendaUpdatePage.cancel();
  });

  it('should create and save ExamesAgenda', async () => {
    const nbButtonsBeforeCreate = await examesAgendaComponentsPage.countDeleteButtons();

    await examesAgendaComponentsPage.clickOnCreateButton();

    await promise.all([
      examesAgendaUpdatePage.setAgendamentoDataInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      examesAgendaUpdatePage.tiposProcedimentoSelectLastOption(),
      examesAgendaUpdatePage.entidadeSaudeSelectLastOption(),
    ]);

    expect(await examesAgendaUpdatePage.getAgendamentoDataInput()).to.contain(
      '2001-01-01T02:30',
      'Expected agendamentoData value to be equals to 2000-12-31'
    );

    await examesAgendaUpdatePage.save();
    expect(await examesAgendaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await examesAgendaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ExamesAgenda', async () => {
    const nbButtonsBeforeDelete = await examesAgendaComponentsPage.countDeleteButtons();
    await examesAgendaComponentsPage.clickOnLastDeleteButton();

    examesAgendaDeleteDialog = new ExamesAgendaDeleteDialog();
    expect(await examesAgendaDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.examesAgenda.delete.question');
    await examesAgendaDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(examesAgendaComponentsPage.title), 5000);

    expect(await examesAgendaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
