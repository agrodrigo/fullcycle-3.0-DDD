import Address from '../value-object/address';
import Customer from './customer'

describe("Customer unit tests", () => {

  it('shoud throw error when id is empty', () => {
    expect(() => {
      let customer = new Customer('', 'John');
    }).toThrowError('Id is required');
  })

  it('shoud throw error when name is empty', () => {
    expect(() => {
      let customer = new Customer('123', '');
    }).toThrowError('Name is required');
  })

  it('shoud change name', () => {

    const customer = new Customer('123', 'John');
    customer.changeName('Jane');

    expect(customer.name).toBe('Jane');
  })

  it('shoud activate customer', () => {
    const customer = new Customer('1', 'Customer 1')
    const address = new Address('Street 1', 123, '13330-250', 'São Paulo', 'São Paulo');
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  })

  it('shoud throw error when address is undefined when you activate a customer', () => {
    
    expect(() => {
      const customer = new Customer('1', 'Customer 1')

      customer.activate();

    }).toThrowError('Address is mandatory to activate a customer');
  })

  it('shoud desactivate customer', () => {
    const customer = new Customer('1', 'Customer 1')

    customer.desactivate();

    expect(customer.isActive()).toBe(false);
  })


})