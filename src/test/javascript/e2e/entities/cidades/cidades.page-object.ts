import { element, by, ElementFinder } from 'protractor';

export class CidadesComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-cidades div table .btn-danger'));
  title = element.all(by.css('jhi-cidades div h2#page-heading span')).first();
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

export class CidadesUpdatePage {
  pageTitle = element(by.id('jhi-cidades-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  cidadeNomeInput = element(by.id('field_cidadeNome'));

  estadosSelect = element(by.id('field_estados'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setCidadeNomeInput(cidadeNome: string): Promise<void> {
    await this.cidadeNomeInput.sendKeys(cidadeNome);
  }

  async getCidadeNomeInput(): Promise<string> {
    return await this.cidadeNomeInput.getAttribute('value');
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

export class CidadesDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-cidades-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-cidades'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
