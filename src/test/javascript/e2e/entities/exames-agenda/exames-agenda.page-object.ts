import { element, by, ElementFinder } from 'protractor';

export class ExamesAgendaComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-exames-agenda div table .btn-danger'));
  title = element.all(by.css('jhi-exames-agenda div h2#page-heading span')).first();
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

export class ExamesAgendaUpdatePage {
  pageTitle = element(by.id('jhi-exames-agenda-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  agendamentoDataInput = element(by.id('field_agendamentoData'));

  tiposProcedimentoSelect = element(by.id('field_tiposProcedimento'));
  entidadeSaudeSelect = element(by.id('field_entidadeSaude'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setAgendamentoDataInput(agendamentoData: string): Promise<void> {
    await this.agendamentoDataInput.sendKeys(agendamentoData);
  }

  async getAgendamentoDataInput(): Promise<string> {
    return await this.agendamentoDataInput.getAttribute('value');
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

  async entidadeSaudeSelectLastOption(): Promise<void> {
    await this.entidadeSaudeSelect.all(by.tagName('option')).last().click();
  }

  async entidadeSaudeSelectOption(option: string): Promise<void> {
    await this.entidadeSaudeSelect.sendKeys(option);
  }

  getEntidadeSaudeSelect(): ElementFinder {
    return this.entidadeSaudeSelect;
  }

  async getEntidadeSaudeSelectedOption(): Promise<string> {
    return await this.entidadeSaudeSelect.element(by.css('option:checked')).getText();
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

export class ExamesAgendaDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-examesAgenda-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-examesAgenda'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
