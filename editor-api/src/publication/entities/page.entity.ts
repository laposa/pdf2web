import { Publication } from "src/publication/entities/publication.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("page")
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  filename: string;

  @ManyToOne(() => Publication, (publication) => publication.pages)
  publication: Publication;
}
