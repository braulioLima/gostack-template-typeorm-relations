import 'reflect-metadata';

import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';

import AppError from '@shared/errors/AppError';

let fakeProductsRepository: FakeProductsRepository;
let createProduct: CreateProductService;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProduct = new CreateProductService(fakeProductsRepository);
  });

  it('should be able create a new Product', async () => {
    const product = await createProduct.execute({
      name: 'Produto 01',
      price: 50,
      quantity: 500,
    });

    expect(product.name).toEqual('Produto 01');
    expect(product.price).toEqual(50);
    expect(product.quantity).toEqual(500);
  });

  it('should not be able create two products with same name', async () => {
    await createProduct.execute({
      name: 'Produto 01',
      price: 50,
      quantity: 500,
    });

    await expect(
      createProduct.execute({
        name: 'Produto 01',
        price: 50,
        quantity: 500,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
