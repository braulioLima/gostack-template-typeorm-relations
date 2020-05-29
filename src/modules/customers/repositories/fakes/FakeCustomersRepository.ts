import { uuid } from 'uuidv4';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '../../infra/typeorm/entities/Customer';

interface ICustomerData {
  id: string;
  name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

class FakeCustomersRepository implements ICustomersRepository {
  private customersRepository: Customer[];

  constructor() {
    this.customersRepository = [];
  }

  public async create({ name, email }: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, {
      id: uuid(),
      email,
      name,
    } as ICustomerData);

    this.customersRepository.push(customer);

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.customersRepository.find(
      ({ id: customer_id }) => customer_id === id,
    );

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.customersRepository.find(
      ({ email: customer_email }) => customer_email === email,
    );

    return customer;
  }
}

export default FakeCustomersRepository;
