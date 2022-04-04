import Order from './order'
import OrderItem from './order-item';

describe("Order unit tests", () => {

  it('shoud throw error when id is empty', () => {
    expect(() => {
      const order = new Order('', '123', []);
    }).toThrowError('Id is required')
  })

  it('shoud throw error when customerId is empty', () => {
    expect(() => {
      const order = new Order('123', '', []);
    }).toThrowError('Customer ID is required')
  })

  it('shoud throw error when Item quantity is empty', () => {
    expect(() => {
      const order = new Order('123', '123', []);
    }).toThrowError('Item quantity must be greater than 0')
  })

  it('shoud calculate total', () => {
    const item1 = new OrderItem('i1', 'Item 1', 100, 'p1', 2);
    const item2 = new OrderItem('i2', 'Item 2', 100, 'p1', 2);
    const order = new Order('o1', 'c1', [item1])
    
    let total = order.total();
    
    expect(total).toBe(200)
    
    const order2 = new Order('o1', 'c1', [item1, item2])

    total = order2.total();

    expect(total).toBe(400)

  })

  it('shoud throw error if the item qtd is less or equal zero', () => {

    expect(() => {
      const item1 = new OrderItem('i1', 'Item 1', 100, 'p1', 0);
      const order = new Order('o1', 'c1', [item1]);

    }).toThrowError('Quantity must be greater than 0');
    
  })

})