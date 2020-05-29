import 'reflect-metadata';

import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';
import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import CreateOrderService from '@modules/orders/services/CreateOrderService';

import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let createOrder: CreateOrderService;

describe('CreateOrder', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();

    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );
  });

  it('should be able to create a new order', async () => {
    const product = await fakeProductsRepository.create({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const customer = await fakeCustomersRepository.create({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    const order = await createOrder.execute({
      customer_id: customer.id,
      products: [
        {
          id: product.id,
          quantity: 5,
        },
      ],
    });

    expect(order).toEqual(
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

  it('should not be able create a new order with invalid customer', async () => {
    const product1 = await fakeProductsRepository.create({
      name: 'Produto 01',
      price: 50,
      quantity: 500,
    });

    const product2 = await fakeProductsRepository.create({
      name: 'Produto 02',
      price: 100,
      quantity: 200,
    });

    await expect(
      createOrder.execute({
        customer_id: 'wrong-id',
        products: [
          {
            id: product1.id,
            quantity: 5,
          },
          {
            id: product2.id,
            quantity: 7,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be ale create a new order with invalid products', async () => {
    const { id: customer_id } = await fakeCustomersRepository.create({
      name: 'John doe',
      email: 'johndoe@example.com',
    });

    const productExistent = await fakeProductsRepository.create({
      name: 'Product 01',
      price: 10,
      quantity: 1000,
    });

    await expect(
      createOrder.execute({
        customer_id,
        products: [
          { id: 'wrong-id', quantity: 3 },
          { id: productExistent.id, quantity: 5 },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an order with products with insufficient quantities', async () => {
    const { id: customer_id } = await fakeCustomersRepository.create({
      name: 'John doe',
      email: 'johndoe@example.com',
    });

    const product = await fakeProductsRepository.create({
      name: 'Product 01',
      price: 10,
      quantity: 1000,
    });

    await expect(
      createOrder.execute({
        customer_id,
        products: [{ id: product.id, quantity: product.quantity + 1 }],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to subtract an product total quantity when it is ordered', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    const product = await fakeProductsRepository.create({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    await createOrder.execute({
      customer_id: customer.id,
      products: [
        {
          id: product.id,
          quantity: 5,
        },
      ],
    });

    let foundProduct = await fakeProductsRepository.findByName(product.name);

    expect(foundProduct).toEqual(
      expect.objectContaining({
        quantity: 45,
      }),
    );

    await createOrder.execute({
      customer_id: customer.id,
      products: [
        {
          id: product.id,
          quantity: 5,
        },
      ],
    });

    foundProduct = await fakeProductsRepository.findByName(product.name);

    expect(foundProduct).toEqual(
      expect.objectContaining({
        quantity: 40,
      }),
    );
  });
});
