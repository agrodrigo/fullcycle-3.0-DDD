import { Sequelize } from 'sequelize-typescript';
import Address from '../../domain/customer/value-object/address';
import Customer from '../../domain/customer/entity/customer';
import Order from '../../domain/checkout/entity/order';
import OrderItem from '../../domain/checkout/entity/order-item';
import Product from '../../domain/product/entity/product';
import CustomerModel from '../customer/sequelize/customer.model';
import OrderItemModel from './sequelize/order-item.model';
import OrderModel from './sequelize/order.model';
import ProductModel from '../product/repository/sequelize/product.model';
import CustomerRepository from '../customer/customer.repository';
import OrderRepository from './order.repository';
import ProductRepository from '../product/repository/product.repository';
import { v4 as uuid } from 'uuid';


describe('Order repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create an order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), 'Customer 1');
    const address = new Address('Street 1', 1, 'zip 1', 'city 1', 'country 1');
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product(uuid(), 'Product 1', 10);
    await productRepository.create(product1);

    const orderItem = new OrderItem(
      uuid(),
      product1.name,
      product1.price,
      product1.id,
      3
    );

    const order = new Order(uuid(), customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);


    const orderModel = await OrderModel.findOne({ 
      where: { id: order.id },
      include: ['items'],
    });


    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          product_id: orderItem.productId,
          order_id: order.id,
        },
      ],
    });
  });

  it('should update an order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), 'Customer 1');
    const address = new Address('Street 1', 1, 'zip 1', 'city 1', 'country 1');
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product(uuid(), 'Product 1', 10);
    await productRepository.create(product1);

    const orderItem = new OrderItem(
      uuid(),
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const order = new Order(uuid(), customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({ 
      where: { id: order.id },
      include: ['items'],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          product_id: orderItem.productId,
          order_id: order.id,
        },
      ],
    });

    order.changeItems([
      new OrderItem(
        orderItem.id,
        product1.name,
        product1.price,
        product1.id,
        3
      ),
    ]);

    await orderRepository.update(order);

    const orderModel2 = await OrderModel.findOne({ 
      where: { id: order.id },
      include: ['items'],
    });

    expect(orderModel2.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          product_id: orderItem.productId,
          order_id: order.id,
        },
      ],
    });
  });

  it('should find a order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), 'Customer 1');
    const address = new Address('Street 1', 1, 'zip 1', 'city 1', 'country 1');
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const productRepository = new ProductRepository();
    const product1 = new Product(uuid(), 'Product 1', 10);
    await productRepository.create(product1);
    
    const orderItem = new OrderItem(
      uuid(),
      product1.name,
      product1.price,
      product1.id,
      2
    );
      
    const order = new Order(uuid(), customer.id, [orderItem]);


    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    });


    const resultOrder = await orderRepository.find(order.id);


    expect(orderModel.toJSON()).toStrictEqual({
      id: resultOrder.id,
      customer_id: resultOrder.customerId,
      total: resultOrder.total(),
      items: [{
        id: orderItem.id,
        name: orderItem.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
        product_id: orderItem.productId,
        order_id: resultOrder.id,
      }]
    });
  });

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository();
    
    const customer1 = new Customer(uuid(), 'Customer 1');
    const address1 = new Address('Street 1', 1, 'zip 1', 'city 1', 'country 1');
    customer1.changeAddress(address1);
    
    await customerRepository.create(customer1);
    
    const productRepository = new ProductRepository();
    const product1 = new Product(uuid(), 'Product 1', 10);
    const product2 = new Product(uuid(), 'Product 2', 20);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      uuid(),
      product1.name,
      product1.price,
      product1.id,
      4
    );

    const orderItem2 = new OrderItem(
      uuid(),
      product2.name,
      product2.price,
      product2.id,
      2
    );

    const order1 = new Order(uuid(), customer1.id, [orderItem1]);
    
    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);


    const customer2 = new Customer(uuid(), 'Customer 2');
    const address2 = new Address('Street 2', 2, 'zip 2', 'city 2', 'country 2');
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);

    const product3 = new Product(uuid(), 'Product 3', 30);
    await productRepository.create(product3);

    const orderItem3 = new OrderItem(
      uuid(),
      product3.name,
      product3.price,
      product3.id,
      3
    );

    const order2 = new Order(uuid(), customer2.id, [orderItem3]); 
    await orderRepository.create(order2);

    const resultOrders = await orderRepository.findAll();

    expect(resultOrders).toHaveLength(2);
    expect(resultOrders).toContainEqual(order1);
    expect(resultOrders).toContainEqual(order2);

  })
  
});