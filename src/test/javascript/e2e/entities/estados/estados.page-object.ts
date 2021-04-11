import { element, by, ElementFinder } from 'protractor';

export class EstadosComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-estados div table .btn-danger'));
  title = element.all(by.css('jhi-estados div h2#page-heading span')).first();
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

export class EstadosUpdatePage {
  pageTitle = element(by.id('jhi-estados-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  estadosNomeInput = element(by.id('field_estadosNome'));
  estadosSiglaInput = element(by.id('field_estadosSigla'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setEstadosNomeInput(estadosNome: string): Promise<void> {
    await this.estadosNomeInput.sendKeys(estadosNome);
  }

  async getEstadosNomeInput(): Promise<string> {
    return await this.estadosNomeInput.getAttribute('value');
  }

  async setEstadosSiglaInput(estadosSigla: string): Promise<void> {
    await this.estadosSiglaInput.sendKeys(estadosSigla);
  }

  async getEstadosSiglaInput(): Promise<string> {
    return await this.estadosSiglaInput.getAttribute('value');
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

export class EstadosDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-estados-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-estados'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
