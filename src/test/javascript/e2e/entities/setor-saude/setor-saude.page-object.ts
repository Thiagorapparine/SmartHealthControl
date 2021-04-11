import { element, by, ElementFinder } from 'protractor';

export class SetorSaudeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-setor-saude div table .btn-danger'));
  title = element.all(by.css('jhi-setor-saude div h2#page-heading span')).first();
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

export class SetorSaudeUpdatePage {
  pageTitle = element(by.id('jhi-setor-saude-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  setorSaudeInput = element(by.id('field_setorSaude'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setSetorSaudeInput(setorSaude: string): Promise<void> {
    await this.setorSaudeInput.sendKeys(setorSaude);
  }

  async getSetorSaudeInput(): Promise<string> {
    return await this.setorSaudeInput.getAttribute('value');
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

export class SetorSaudeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-setorSaude-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-setorSaude'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
