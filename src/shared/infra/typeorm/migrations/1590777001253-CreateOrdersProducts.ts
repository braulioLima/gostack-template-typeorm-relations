import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrdersProducts1590777001253
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'DECIMAL',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'INTEGER',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_PRODUCT_ID',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onUpdate: 'RESTRICT',
            onDelete: 'SET NULL',
          },
          {
            name: 'FK_ORDER_ID',
            columnNames: ['order_id'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('orders_products');
    if (table) {
      await queryRunner.dropForeignKeys(table, table.foreignKeys);
      await queryRunner.dropTable(table);
    }
  }
}
