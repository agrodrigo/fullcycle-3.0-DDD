/**
 * Pastas organização
 * 
 * DOMAIN -> Complexidade de negócio
 * ./entity
 *  - customer.ts (regra de negócio)
 * 
 * MUNDO EXTERNO -> Complexidade acidental
 * ./infra/entity/model
 *  - customer.ts (get, set -> persistência no BD)
 */

class Customer {
  _id: string;
  _name: string;
  _address?: string;
  _active: boolean;

  constructor(id: string, name: string){
    this._id = id;
    this._name = name;
    this._active = false;
    this.validate();
  }

  validate() {
    if (this._name.length === 0) {
      throw new Error('Name is required');
    }
    if (this._id.length === 0) {
      throw new Error('Id is required');
    }
  }

  changeName(name: string) {
    this._name = name;
  }

  activate() {
    if (this._address?.length === 0) {
      throw new Error('Address is mandatory to activate a customer');
    }
    this._active = true;
  }

  desactivate() {
    this._active = false;
  }
}