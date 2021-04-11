import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UsuariosSaudeComponentsPage, UsuariosSaudeDeleteDialog, UsuariosSaudeUpdatePage } from './usuarios-saude.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('UsuariosSaude e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let usuariosSaudeComponentsPage: UsuariosSaudeComponentsPage;
  let usuariosSaudeUpdatePage: UsuariosSaudeUpdatePage;
  let usuariosSaudeDeleteDialog: UsuariosSaudeDeleteDialog;
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load UsuariosSaudes', async () => {
    await navBarPage.goToEntity('usuarios-saude');
    usuariosSaudeComponentsPage = new UsuariosSaudeComponentsPage();
    await browser.wait(ec.visibilityOf(usuariosSaudeComponentsPage.title), 5000);
    expect(await usuariosSaudeComponentsPage.getTitle()).to.eq('tccSmartHealthControlApp.usuariosSaude.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(usuariosSaudeComponentsPage.entities), ec.visibilityOf(usuariosSaudeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create UsuariosSaude page', async () => {
    await usuariosSaudeComponentsPage.clickOnCreateButton();
    usuariosSaudeUpdatePage = new UsuariosSaudeUpdatePage();
    expect(await usuariosSaudeUpdatePage.getPageTitle()).to.eq('tccSmartHealthControlApp.usuariosSaude.home.createOrEditLabel');
    await usuariosSaudeUpdatePage.cancel();
  });

  it('should create and save UsuariosSaudes', async () => {
    const nbButtonsBeforeCreate = await usuariosSaudeComponentsPage.countDeleteButtons();

    await usuariosSaudeComponentsPage.clickOnCreateButton();

    await promise.all([
      usuariosSaudeUpdatePage.setUsuarioFotoInput(absolutePath),
      usuariosSaudeUpdatePage.setUsuarioNomeInput('usuarioNome'),
      usuariosSaudeUpdatePage.setUsuarioCPFInput('804.03636645'),
      usuariosSaudeUpdatePage.setUsuarioDataNascimentoInput('91|06-7721'),
      usuariosSaudeUpdatePage.userSelectLastOption(),
      usuariosSaudeUpdatePage.cidadesSelectLastOption(),
    ]);

    expect(await usuariosSaudeUpdatePage.getUsuarioFotoInput()).to.endsWith(
      fileNameToUpload,
      'Expected UsuarioFoto value to be end with ' + fileNameToUpload
    );
    expect(await usuariosSaudeUpdatePage.getUsuarioNomeInput()).to.eq(
      'usuarioNome',
      'Expected UsuarioNome value to be equals to usuarioNome'
    );
    expect(await usuariosSaudeUpdatePage.getUsuarioCPFInput()).to.eq(
      '804.03636645',
      'Expected UsuarioCPF value to be equals to 804.03636645'
    );
    expect(await usuariosSaudeUpdatePage.getUsuarioDataNascimentoInput()).to.eq(
      '91|06-7721',
      'Expected UsuarioDataNascimento value to be equals to 91|06-7721'
    );

    await usuariosSaudeUpdatePage.save();
    expect(await usuariosSaudeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await usuariosSaudeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last UsuariosSaude', async () => {
    const nbButtonsBeforeDelete = await usuariosSaudeComponentsPage.countDeleteButtons();
    await usuariosSaudeComponentsPage.clickOnLastDeleteButton();

    usuariosSaudeDeleteDialog = new UsuariosSaudeDeleteDialog();
    expect(await usuariosSaudeDeleteDialog.getDialogTitle()).to.eq('tccSmartHealthControlApp.usuariosSaude.delete.question');
    await usuariosSaudeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(usuariosSaudeComponentsPage.title), 5000);

    expect(await usuariosSaudeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
