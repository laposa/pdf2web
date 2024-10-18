import { Publication } from 'src/common/entities/publication.entity';
import {
  AfterLoad,
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

  @Column({ nullable: true })
  url: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  areas_json: any;

  @ManyToOne(() => Publication, (publication) => publication.pages)
  publication: Publication;

  @AfterLoad()
  generateUrl(): void {
    this.url = `${process.env.APP_URL ?? 'http://localhost:3000'}${
      this.filename
    }`;
  }
}
