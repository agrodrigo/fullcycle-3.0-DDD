import { where } from 'sequelize/types';
import Order from '../../domain/entity/order';
import OrderItem from '../../domain/entity/order-item';
import Product from '../../domain/entity/product';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    try{
      await OrderModel.create(
        {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.total(),
          items: entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          include: [{model: OrderItemModel}],
        }
      )
    } catch(error) {
      throw new Error("Order coudtn be created.");
    }
    
  }

  async update(entity: Order): Promise<void> {
    try{
      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
          items: entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          where: {
            id: entity.id,
          }
        },
      )
    } catch(error) {
      throw new Error("Order coudtn be updated.");
    }
  }


  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({ 
        where: {
          id: id, 
        },
        include: [{model: OrderItemModel}],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const order = new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map((item) => 
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity,
        )
      )
    );


    return order;

  }

  async findAll(): Promise<Order[]> {
    let orderModels;

    try{
      
      orderModels = await OrderModel.findAll({
        include: [{model: OrderItemModel}],
      });

    } catch (error) {
      throw new Error("Order not found");
    }

    const orders = orderModels.map((order) =>
      new Order(
        order.id,
        order.customer_id,
        order.items.map((item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          )
        )
      )
    );

    return orders;
  }

}