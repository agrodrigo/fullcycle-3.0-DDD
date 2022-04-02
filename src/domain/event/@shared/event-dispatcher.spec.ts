import Address from '../../entity/address';
import Customer from '../../entity/customer';
import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler';
import ProductCreatedEvent from '../product/product-created.event';
import CustomerAddressChangedEvent from './customer/customer-address-changed.event';
import CustomerCreatedEvent from './customer/customer-created.event';
import EnviaConsoleLogHandler1 from './customer/handler/envia-console-log-1.handler';
import EnviaConsoleLogHandler from './customer/handler/envia-console-log.handler';
import EnviaConsoleLogHandler2 from './customer/handler/envia-consolo-log-2.handler';
import EventDispatcher from './event-dispatcher';

describe('Domain events tests', () => {

  it('should register an event handler', () => {
    const eventDispather = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispather.register('ProductCreatedEvent', eventHandler);

    expect(eventDispather.getEventHandlers['ProductCreatedEvent']).toBeDefined();
    expect(eventDispather.getEventHandlers['ProductCreatedEvent'].length).toBe(1);
    expect(eventDispather.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);
  })

  it('should unregister an aevent handler', () => {

    const eventDispather = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispather.register('ProductCreatedEvent', eventHandler)

    expect(eventDispather.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

    eventDispather.unregister('ProductCreatedEvent', eventHandler);

    expect(
      eventDispather.getEventHandlers['ProductCreatedEvent']
    ).toBeDefined();
    expect(eventDispather.getEventHandlers['ProductCreatedEvent'].length).toBe(0);
  })

  it('should unregister all event handlers', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined();
  });

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, 'handle');

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
    ).toMatchObject(eventHandler)

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'Product 1',
      description: 'Product 1 description',
      price: 10.0,
    });
  
    //Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handler() deve ser chamado.
    eventDispatcher.notify(productCreatedEvent);
    
    expect(spyEventHandler).toHaveBeenCalled();

  });

  it ('should notify that a customer was created', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLogHandler1();
    const eventHandler2 = new EnviaConsoleLogHandler2();
    const spyEventHandler1 = jest.spyOn(eventHandler1, 'handle')
    const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle')

    eventDispatcher.register('CustomerCreatedEvent', eventHandler1);
    eventDispatcher.register('CustomerCreatedEvent', eventHandler2);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler1);
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]).toMatchObject(eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({});

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  })

  it ('should notify that a customer address was changed', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, 'handle');

    eventDispatcher.register('CustomerAddressChangedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['CustomerAddressChangedEvent'][0]).toMatchObject(eventHandler);

    const customer = new Customer('123', 'Customer 1');
    const address = new Address('Rua 1', 1, '12345678', 'city 1', 'country 1')

    customer.changeAddress(address);

    const customerAddressChangedEvent = new CustomerAddressChangedEvent(customer);
    eventDispatcher.notify(customerAddressChangedEvent);
    
    expect(spyEventHandler).toHaveBeenCalled();
  })


})