import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseEntityAutoNumberId extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
