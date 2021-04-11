import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EstadosComponentsPage, EstadosDeleteDialog, EstadosUpdatePage } from './estados.page-object';

const expect = chai.expect;

describe('Estados e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let estadosComponentsPage: EstadosComponentsPage;
  let estadosUpdatePage: EstadosUpdatePage;
  let estadosDeleteDialog: EstadosDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Estados', async () => {
    await navBarPage.goToEntity('estados');
    estadosComponentsPage = new EstadosComponentsPage();
    await browser.wait(ec.visibilityOf(estadosComponentsPage.title), 5000);
    expect(await estadosComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.estados.home.title');
    await browser.wait(ec.or(ec.visibilityOf(estadosComponentsPage.entities), ec.visibilityOf(estadosComponentsPage.noResult)), 1000);
  });

  it('should load create Estados page', async () => {
    await estadosComponentsPage.clickOnCreateButton();
    estadosUpdatePage = new EstadosUpdatePage();
    expect(await estadosUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.estados.home.createOrEditLabel');
    await estadosUpdatePage.cancel();
  });

  it('should create and save Estados', async () => {
    const nbButtonsBeforeCreate = await estadosComponentsPage.countDeleteButtons();

    await estadosComponentsPage.clickOnCreateButton();

    await promise.all([estadosUpdatePage.setEstadosNomeInput('estadosNome'), estadosUpdatePage.setEstadosSiglaInput('estadosSigla')]);

    expect(await estadosUpdatePage.getEstadosNomeInput()).to.eq('estadosNome', 'Expected EstadosNome value to be equals to estadosNome');
    expect(await estadosUpdatePage.getEstadosSiglaInput()).to.eq(
      'estadosSigla',
      'Expected EstadosSigla value to be equals to estadosSigla'
    );

    await estadosUpdatePage.save();
    expect(await estadosUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await estadosComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Estados', async () => {
    const nbButtonsBeforeDelete = await estadosComponentsPage.countDeleteButtons();
    await estadosComponentsPage.clickOnLastDeleteButton();

    estadosDeleteDialog = new EstadosDeleteDialog();
    expect(await estadosDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.estados.delete.question');
    await estadosDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(estadosComponentsPage.title), 5000);

    expect(await estadosComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
