import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/publication/entities/page.entity';
import { Publication } from 'src/publication/entities/publication.entity';
import { PublicationController } from 'src/publication/publication.controller';
import { PublicationService } from 'src/publication/publication.service';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Page])],
  controllers: [PublicationController],
  providers: [PublicationService],
})
export class PublicationModule {}
