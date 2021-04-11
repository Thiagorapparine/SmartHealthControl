import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProfissionaisComponentsPage, ProfissionaisDeleteDialog, ProfissionaisUpdatePage } from './profissionais.page-object';

const expect = chai.expect;

describe('Profissionais e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let profissionaisComponentsPage: ProfissionaisComponentsPage;
  let profissionaisUpdatePage: ProfissionaisUpdatePage;
  let profissionaisDeleteDialog: ProfissionaisDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Profissionais', async () => {
    await navBarPage.goToEntity('profissionais');
    profissionaisComponentsPage = new ProfissionaisComponentsPage();
    await browser.wait(ec.visibilityOf(profissionaisComponentsPage.title), 5000);
    expect(await profissionaisComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.profissionais.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(profissionaisComponentsPage.entities), ec.visibilityOf(profissionaisComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Profissionais page', async () => {
    await profissionaisComponentsPage.clickOnCreateButton();
    profissionaisUpdatePage = new ProfissionaisUpdatePage();
    expect(await profissionaisUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.profissionais.home.createOrEditLabel');
    await profissionaisUpdatePage.cancel();
  });

  it('should create and save Profissionais', async () => {
    const nbButtonsBeforeCreate = await profissionaisComponentsPage.countDeleteButtons();

    await profissionaisComponentsPage.clickOnCreateButton();

    await promise.all([
      profissionaisUpdatePage.setProfissionalNomeInput('profissionalNome'),
      profissionaisUpdatePage.setProfissionalHoraInicioInput('10:32'),
      profissionaisUpdatePage.setProfissionalHoraFimInput('08:44'),
      profissionaisUpdatePage.estadosSelectLastOption(),
      profissionaisUpdatePage.setorSaudeSelectLastOption(),
    ]);

    expect(await profissionaisUpdatePage.getProfissionalNomeInput()).to.eq(
      'profissionalNome',
      'Expected ProfissionalNome value to be equals to profissionalNome'
    );
    expect(await profissionaisUpdatePage.getProfissionalHoraInicioInput()).to.eq(
      '10:32',
      'Expected ProfissionalHoraInicio value to be equals to 10:32'
    );
    expect(await profissionaisUpdatePage.getProfissionalHoraFimInput()).to.eq(
      '08:44',
      'Expected ProfissionalHoraFim value to be equals to 08:44'
    );

    await profissionaisUpdatePage.save();
    expect(await profissionaisUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await profissionaisComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Profissionais', async () => {
    const nbButtonsBeforeDelete = await profissionaisComponentsPage.countDeleteButtons();
    await profissionaisComponentsPage.clickOnLastDeleteButton();

    profissionaisDeleteDialog = new ProfissionaisDeleteDialog();
    expect(await profissionaisDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.profissionais.delete.question');
    await profissionaisDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(profissionaisComponentsPage.title), 5000);

    expect(await profissionaisComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
