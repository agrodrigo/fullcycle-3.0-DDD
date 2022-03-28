export default class Address {
  _street: string;
  _number: number;
  _zip: string;
  _city: string;
  _country: string;

  constructor(street: string, number: number, zip: string, city: string, country: string) {
    this._street = street;
    this._number = number;
    this._zip = zip;
    this._city = city;
    this._country = country;
    this.validate()
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get zip(): string {
    return this._zip;
  }

  get city(): string {
    return this._city;
  }

  get country(): string {
    return this._country;
  }

  validate() {
    if (this._street.length === 0) {
      throw new Error('Street is required');
    }
    if (this._number === 0) {
      throw new Error('Number is required');
    }
    if (this._zip.length === 0) {
      throw new Error('Zip is required');
    }
    if (this._city.length === 0) {
      throw new Error('City is required');
    }
    if (this._country.length === 0) {
      throw new Error('Country is required');
    }
  }

  toString() {
    return `${this._street}, ${this._number}. ${this._city} - ${this._country}. ZIP ${this._zip}`
  }
}