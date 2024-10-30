import { Publication } from 'src/common/entities/publication.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('page')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  filename: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  areas_json: any;

  @ManyToOne(() => Publication, (publication) => publication.pages)
  publication: Publication;
}
