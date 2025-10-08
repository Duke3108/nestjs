import { FindOptionsWhere } from 'typeorm';

export interface CustomQuery<T> {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
  where?: () => FindOptionsWhere<T> | FindOptionsWhere<T>[]; // Accepts single or multiple conditions
  relations?: string[];
}
