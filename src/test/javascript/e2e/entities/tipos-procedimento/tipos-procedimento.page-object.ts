import { element, by, ElementFinder } from 'protractor';

export class TiposProcedimentoComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-tipos-procedimento div table .btn-danger'));
  title = element.all(by.css('jhi-tipos-procedimento div h2#page-heading span')).first();
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

export class TiposProcedimentoUpdatePage {
  pageTitle = element(by.id('jhi-tipos-procedimento-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  procedimentoNomeInput = element(by.id('field_procedimentoNome'));
  procedimentoDescricaoInput = element(by.id('field_procedimentoDescricao'));

  setorSaudeSelect = element(by.id('field_setorSaude'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setProcedimentoNomeInput(procedimentoNome: string): Promise<void> {
    await this.procedimentoNomeInput.sendKeys(procedimentoNome);
  }

  async getProcedimentoNomeInput(): Promise<string> {
    return await this.procedimentoNomeInput.getAttribute('value');
  }

  async setProcedimentoDescricaoInput(procedimentoDescricao: string): Promise<void> {
    await this.procedimentoDescricaoInput.sendKeys(procedimentoDescricao);
  }

  async getProcedimentoDescricaoInput(): Promise<string> {
    return await this.procedimentoDescricaoInput.getAttribute('value');
  }

  async setorSaudeSelectLastOption(): Promise<void> {
    await this.setorSaudeSelect.all(by.tagName('option')).last().click();
  }

  async setorSaudeSelectOption(option: string): Promise<void> {
    await this.setorSaudeSelect.sendKeys(option);
  }

  getSetorSaudeSelect(): ElementFinder {
    return this.setorSaudeSelect;
  }

  async getSetorSaudeSelectedOption(): Promise<string> {
    return await this.setorSaudeSelect.element(by.css('option:checked')).getText();
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

export class TiposProcedimentoDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-tiposProcedimento-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-tiposProcedimento'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
