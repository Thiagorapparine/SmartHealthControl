import { element, by, ElementFinder } from 'protractor';

export class ProfissionaisComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-profissionais div table .btn-danger'));
  title = element.all(by.css('jhi-profissionais div h2#page-heading span')).first();
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

export class ProfissionaisUpdatePage {
  pageTitle = element(by.id('jhi-profissionais-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  profissionalNomeInput = element(by.id('field_profissionalNome'));
  profissionalHoraInicioInput = element(by.id('field_profissionalHoraInicio'));
  profissionalHoraFimInput = element(by.id('field_profissionalHoraFim'));

  estadosSelect = element(by.id('field_estados'));
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

  async setProfissionalNomeInput(profissionalNome: string): Promise<void> {
    await this.profissionalNomeInput.sendKeys(profissionalNome);
  }

  async getProfissionalNomeInput(): Promise<string> {
    return await this.profissionalNomeInput.getAttribute('value');
  }

  async setProfissionalHoraInicioInput(profissionalHoraInicio: string): Promise<void> {
    await this.profissionalHoraInicioInput.sendKeys(profissionalHoraInicio);
  }

  async getProfissionalHoraInicioInput(): Promise<string> {
    return await this.profissionalHoraInicioInput.getAttribute('value');
  }

  async setProfissionalHoraFimInput(profissionalHoraFim: string): Promise<void> {
    await this.profissionalHoraFimInput.sendKeys(profissionalHoraFim);
  }

  async getProfissionalHoraFimInput(): Promise<string> {
    return await this.profissionalHoraFimInput.getAttribute('value');
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

export class ProfissionaisDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-profissionais-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-profissionais'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
