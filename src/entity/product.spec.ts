import Product from './product';

describe("Product unit tests", () => {

  it('shoud throw error when id is empty', () => {
    expect(() => {
      const product = new Product('', 'Product 1', 100);
    }).toThrowError('Id is required');
  })

  it('shoud throw error when name is empty', () => {
    expect(() => {
      const product = new Product('123', '', 100);
    }).toThrowError('Name is required');
  })

  it('shoud throw error when price is less than zero', () => {
    expect(() => {
      const product = new Product('123', 'Name 1', -1);
    }).toThrowError('Price must be greater than zero');
  })

  it('shoud change name', () => {
    
    const product = new Product('123', 'Product 1', 100)
    product.changeName('Product 2');
    expect(product.name).toBe('Product 2');
  })

  it('shoud change price', () => {
    const product = new Product('123', 'Product 1', 100)
    product.changePrice(200);
    expect(product.price).toBe(200);
  })
  
})