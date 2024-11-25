import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseEntityId extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
