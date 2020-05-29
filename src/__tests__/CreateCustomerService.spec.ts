import 'reflect-metadata';
import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toEqual('John Doe');
  });

  it('should not be able create two customers with same e-mail address', async () => {
    await createCustomer.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    await expect(
      createCustomer.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
