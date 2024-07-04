import { Page } from 'src/publication/entities/page.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('publication')
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  author: string;

  @OneToMany(() => Page, (page) => page.publication, {
    eager: true,
    onDelete: 'CASCADE',
  })
  pages: Page[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
