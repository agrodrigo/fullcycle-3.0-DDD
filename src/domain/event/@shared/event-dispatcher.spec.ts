import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler';
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
})