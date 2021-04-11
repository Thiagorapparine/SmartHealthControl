import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ConsultasAgendaComponentsPage, ConsultasAgendaDeleteDialog, ConsultasAgendaUpdatePage } from './consultas-agenda.page-object';

const expect = chai.expect;

describe('ConsultasAgenda e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let consultasAgendaComponentsPage: ConsultasAgendaComponentsPage;
  let consultasAgendaUpdatePage: ConsultasAgendaUpdatePage;
  let consultasAgendaDeleteDialog: ConsultasAgendaDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ConsultasAgenda', async () => {
    await navBarPage.goToEntity('consultas-agenda');
    consultasAgendaComponentsPage = new ConsultasAgendaComponentsPage();
    await browser.wait(ec.visibilityOf(consultasAgendaComponentsPage.title), 5000);
    expect(await consultasAgendaComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.consultasAgenda.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(consultasAgendaComponentsPage.entities), ec.visibilityOf(consultasAgendaComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ConsultasAgenda page', async () => {
    await consultasAgendaComponentsPage.clickOnCreateButton();
    consultasAgendaUpdatePage = new ConsultasAgendaUpdatePage();
    expect(await consultasAgendaUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.consultasAgenda.home.createOrEditLabel');
    await consultasAgendaUpdatePage.cancel();
  });

  it('should create and save ConsultasAgenda', async () => {
    const nbButtonsBeforeCreate = await consultasAgendaComponentsPage.countDeleteButtons();

    await consultasAgendaComponentsPage.clickOnCreateButton();

    await promise.all([
      consultasAgendaUpdatePage.setAgendamentoDataInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      consultasAgendaUpdatePage.usuariosSaudeSelectLastOption(),
      consultasAgendaUpdatePage.setorSaudeSelectLastOption(),
      consultasAgendaUpdatePage.entidadeSaudeSelectLastOption(),
    ]);

    expect(await consultasAgendaUpdatePage.getAgendamentoDataInput()).to.contain(
      '2001-01-01T02:30',
      'Expected agendamentoData value to be equals to 2000-12-31'
    );

    await consultasAgendaUpdatePage.save();
    expect(await consultasAgendaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await consultasAgendaComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ConsultasAgenda', async () => {
    const nbButtonsBeforeDelete = await consultasAgendaComponentsPage.countDeleteButtons();
    await consultasAgendaComponentsPage.clickOnLastDeleteButton();

    consultasAgendaDeleteDialog = new ConsultasAgendaDeleteDialog();
    expect(await consultasAgendaDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.consultasAgenda.delete.question');
    await consultasAgendaDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(consultasAgendaComponentsPage.title), 5000);

    expect(await consultasAgendaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
