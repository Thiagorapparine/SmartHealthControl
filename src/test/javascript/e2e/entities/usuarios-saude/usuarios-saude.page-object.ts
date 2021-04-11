import { element, by, ElementFinder } from 'protractor';

export class UsuariosSaudeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-usuarios-saude div table .btn-danger'));
  title = element.all(by.css('jhi-usuarios-saude div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class UsuariosSaudeUpdatePage {
  pageTitle = element(by.id('jhi-usuarios-saude-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  usuarioFotoInput = element(by.id('file_usuarioFoto'));
  usuarioNomeInput = element(by.id('field_usuarioNome'));
  usuarioCPFInput = element(by.id('field_usuarioCPF'));
  usuarioDataNascimentoInput = element(by.id('field_usuarioDataNascimento'));

  userSelect = element(by.id('field_user'));
  cidadesSelect = element(by.id('field_cidades'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setUsuarioFotoInput(usuarioFoto: string): Promise<void> {
    await this.usuarioFotoInput.sendKeys(usuarioFoto);
  }

  async getUsuarioFotoInput(): Promise<string> {
    return await this.usuarioFotoInput.getAttribute('value');
  }

  async setUsuarioNomeInput(usuarioNome: string): Promise<void> {
    await this.usuarioNomeInput.sendKeys(usuarioNome);
  }

  async getUsuarioNomeInput(): Promise<string> {
    return await this.usuarioNomeInput.getAttribute('value');
  }

  async setUsuarioCPFInput(usuarioCPF: string): Promise<void> {
    await this.usuarioCPFInput.sendKeys(usuarioCPF);
  }

  async getUsuarioCPFInput(): Promise<string> {
    return await this.usuarioCPFInput.getAttribute('value');
  }

  async setUsuarioDataNascimentoInput(usuarioDataNascimento: string): Promise<void> {
    await this.usuarioDataNascimentoInput.sendKeys(usuarioDataNascimento);
  }

  async getUsuarioDataNascimentoInput(): Promise<string> {
    return await this.usuarioDataNascimentoInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async cidadesSelectLastOption(): Promise<void> {
    await this.cidadesSelect.all(by.tagName('option')).last().click();
  }

  async cidadesSelectOption(option: string): Promise<void> {
    await this.cidadesSelect.sendKeys(option);
  }

  getCidadesSelect(): ElementFinder {
    return this.cidadesSelect;
  }

  async getCidadesSelectedOption(): Promise<string> {
    return await this.cidadesSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class UsuariosSaudeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-usuariosSaude-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-usuariosSaude'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
