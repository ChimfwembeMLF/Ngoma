import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExternalUrlToVideo1785515457000 implements MigrationInterface {
  name = 'AddExternalUrlToVideo1785515457000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'videos',
      new TableColumn({
        name: 'external_url',
        type: 'varchar',
        length: '2048',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('videos', 'external_url');
  }
}
