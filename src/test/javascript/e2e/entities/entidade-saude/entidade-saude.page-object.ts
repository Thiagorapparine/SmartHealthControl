import { element, by, ElementFinder } from 'protractor';

export class EntidadeSaudeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-entidade-saude div table .btn-danger'));
  title = element.all(by.css('jhi-entidade-saude div h2#page-heading span')).first();
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

export class EntidadeSaudeUpdatePage {
  pageTitle = element(by.id('jhi-entidade-saude-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  entidadeNomeInput = element(by.id('field_entidadeNome'));
  entidadeSetorSelect = element(by.id('field_entidadeSetor'));
  entidadeEnderecoInput = element(by.id('field_entidadeEndereco'));

  saudeTipoSelect = element(by.id('field_saudeTipo'));
  estadosSelect = element(by.id('field_estados'));
  cidadesSelect = element(by.id('field_cidades'));
  tiposProcedimentoSelect = element(by.id('field_tiposProcedimento'));
  profissionaisSelect = element(by.id('field_profissionais'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setEntidadeNomeInput(entidadeNome: string): Promise<void> {
    await this.entidadeNomeInput.sendKeys(entidadeNome);
  }

  async getEntidadeNomeInput(): Promise<string> {
    return await this.entidadeNomeInput.getAttribute('value');
  }

  async setEntidadeSetorSelect(entidadeSetor: string): Promise<void> {
    await this.entidadeSetorSelect.sendKeys(entidadeSetor);
  }

  async getEntidadeSetorSelect(): Promise<string> {
    return await this.entidadeSetorSelect.element(by.css('option:checked')).getText();
  }

  async entidadeSetorSelectLastOption(): Promise<void> {
    await this.entidadeSetorSelect.all(by.tagName('option')).last().click();
  }

  async setEntidadeEnderecoInput(entidadeEndereco: string): Promise<void> {
    await this.entidadeEnderecoInput.sendKeys(entidadeEndereco);
  }

  async getEntidadeEnderecoInput(): Promise<string> {
    return await this.entidadeEnderecoInput.getAttribute('value');
  }

  async saudeTipoSelectLastOption(): Promise<void> {
    await this.saudeTipoSelect.all(by.tagName('option')).last().click();
  }

  async saudeTipoSelectOption(option: string): Promise<void> {
    await this.saudeTipoSelect.sendKeys(option);
  }

  getSaudeTipoSelect(): ElementFinder {
    return this.saudeTipoSelect;
  }

  async getSaudeTipoSelectedOption(): Promise<string> {
    return await this.saudeTipoSelect.element(by.css('option:checked')).getText();
  }

  async estadosSelectLastOption(): Promise<void> {
    await this.estadosSelect.all(by.tagName('option')).last().click();
  }

  async estadosSelectOption(option: string): Promise<void> {
    await this.estadosSelect.sendKeys(option);
  }

  getEstadosSelect(): ElementFinder {
    return this.estadosSelect;
  }

  async getEstadosSelectedOption(): Promise<string> {
    return await this.estadosSelect.element(by.css('option:checked')).getText();
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

  async tiposProcedimentoSelectLastOption(): Promise<void> {
    await this.tiposProcedimentoSelect.all(by.tagName('option')).last().click();
  }

  async tiposProcedimentoSelectOption(option: string): Promise<void> {
    await this.tiposProcedimentoSelect.sendKeys(option);
  }

  getTiposProcedimentoSelect(): ElementFinder {
    return this.tiposProcedimentoSelect;
  }

  async getTiposProcedimentoSelectedOption(): Promise<string> {
    return await this.tiposProcedimentoSelect.element(by.css('option:checked')).getText();
  }

  async profissionaisSelectLastOption(): Promise<void> {
    await this.profissionaisSelect.all(by.tagName('option')).last().click();
  }

  async profissionaisSelectOption(option: string): Promise<void> {
    await this.profissionaisSelect.sendKeys(option);
  }

  getProfissionaisSelect(): ElementFinder {
    return this.profissionaisSelect;
  }

  async getProfissionaisSelectedOption(): Promise<string> {
    return await this.profissionaisSelect.element(by.css('option:checked')).getText();
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

export class EntidadeSaudeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-entidadeSaude-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-entidadeSaude'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
