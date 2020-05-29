import { uuid } from 'uuidv4';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../../infra/typeorm/entities/Order';

class FakeOrdersRepository implements IOrdersRepository {
  private ordersRepository: Order[];

  constructor() {
    this.ordersRepository = [];
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = new Order();

    Object.assign(order, {
      id: uuid(),
      customer,
      order_products: products,
    });

    this.ordersRepository.push(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ordersRepository.find(
      ({ id: order_id }) => order_id === id,
    );

    return order;
  }
}

export default FakeOrdersRepository;
