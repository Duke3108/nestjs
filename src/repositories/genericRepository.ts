import { BadRequestException } from '@nestjs/common';
import { SortField } from 'common/enum/sortField';
import { SortOrder } from 'common/enum/sortOrder';
import {
  EntityManager,
  Repository,
  type DeepPartial,
  type EntityTarget,
  type FindManyOptions,
  type FindOneOptions,
  type FindOptionsOrder,
  type FindOptionsWhere,
  type ObjectLiteral,
} from 'typeorm';

export class GenericRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(
    entity: EntityTarget<T>,
    private manager: EntityManager,
  ) {
    this.repository = this.manager.getRepository(entity);
  }

  //code mau
  public async findMany(req: {
    pageNumber: number;
    pageSize: number;
    sortField: string;
    sortOrder: string;
    where?: () => FindOptionsWhere<T> | FindOptionsWhere<T>[]; // Accepts single or multiple conditions
    relations?: string[];
  }): Promise<[T[], number]> {
    const {
      pageNumber,
      pageSize,
      sortField = SortField.NAME,
      sortOrder = SortOrder.ASC,
      where,
      relations,
    } = req;

    return await this.repository.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      where: where ? where() : {},
      withDeleted: false,
      order: { [sortField]: sortOrder } as FindOptionsOrder<T>,
      relations,
    });
  }

  public async findById(
    id: number | string,
    select?: string[],
    relations?: string[],
  ): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as any,
      withDeleted: false,
      relations: relations as string[],
      select: select as string[],
    });
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  public async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  public async update(id: number, data: Partial<T>): Promise<void> {
    await this.repository.update(id, data);
  }

  public async delete(id: number, msg?: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) throw new BadRequestException(msg);
    await this.repository.delete(id);
  }

  public async softDelete(id: number, msg: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) throw new BadRequestException(msg);
    await this.repository.softDelete(id);
  }

  public async softDeleteBy(where: FindOptionsWhere<T>) {
    await this.repository.softDelete(where);
  }

  public getRepository(): Repository<T> {
    return this.repository;
  }
}
