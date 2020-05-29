import { uuid } from 'uuidv4';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../../infra/typeorm/entities/Product';

interface IFindProducts {
  id: string;
}

class FakeProductsRepository implements IProductsRepository {
  private productsRepository: Product[];

  constructor() {
    this.productsRepository = [];
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, {
      id: uuid(),
      name,
      price,
      quantity,
    } as ICreateProductDTO);

    this.productsRepository.push(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.productsRepository.find(
      ({ name: product_name }) => product_name === name,
    );

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const foundProducts = this.productsRepository.filter(product =>
      products.find(({ id }) => product.id === id),
    );

    return foundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    this.productsRepository.forEach((product, product_index) => {
      products.forEach(request_product => {
        if (product.id === request_product.id) {
          this.productsRepository[product_index] = {
            ...product,
            quantity: product.quantity - request_product.quantity,
          };
        }
      });
    });

    return this.productsRepository;
  }
}

export default FakeProductsRepository;
