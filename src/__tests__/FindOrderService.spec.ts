import 'reflect-metadata';

import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';
import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
// import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeOrdersRepository: FakeOrdersRepository;
// let createOrder = CreateOrderService;
let findOrder: FindOrderService;

describe('FindOrder', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();

    // creatOrder = new CreateOrderService()
    findOrder = new FindOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );
  });

  it('should be able to list one specific order', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    const product = await fakeProductsRepository.create({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const order = await fakeOrdersRepository.create({
      customer: { ...customer },
      products: [
        {
          product_id: product.id,
          price: product.price,
          quantity: 5,
        },
      ],
    });

    const response = await findOrder.execute({ id: order.id });

    expect(response).toEqual(
      expect.objectContaining({
        customer: expect.objectContaining({
          id: customer.id,
          name: 'Rocketseat',
          email: 'oi@rocketseat.com.br',
        }),
        order_products: expect.arrayContaining([
          expect.objectContaining({
            product_id: product.id,
            price: 500.0,
            quantity: 5,
          }),
        ]),
      }),
    );
  });
});
