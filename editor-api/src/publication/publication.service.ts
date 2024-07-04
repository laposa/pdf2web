import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/publication/entities/page.entity';
import { convert } from 'src/publication/lib/pdf-to-images';
import { Publication } from 'src/publication/entities/publication.entity';
import { CreatePublicationDto } from 'src/publication/dto/create-publication.dto';
import { UpdatePublicationDto } from 'src/publication/dto/update-publication.dto';
import { UpdatePageDto } from 'src/publication/dto/update-page.dto';
import { mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  async create(
    CreatePublicationDto: CreatePublicationDto,
    file: Express.Multer.File,
  ) {
    const publication = new Publication();
    publication.title = CreatePublicationDto.title;
    publication.pages = [];

    let createdPublication = await this.publicationRepository.save(publication);

    const paths = await convert(createdPublication, file);

    for (const path of paths) {
      const pageData = new Page();
      pageData.name = `Page`;
      pageData.filename = path;

      const page = await this.pageRepository.save(pageData);
      await publication.pages.push(page);
    }

    createdPublication = await this.publicationRepository.save(publication);

    await this.generateManifest(createdPublication.id);

    return { publication };
  }

  async findAll(): Promise<Publication[]> {
    return await this.publicationRepository.find({});
  }

  async findOne(id: number) {
    // TODO: is there a simpler way to order relationships?
    // order the pages by id
    const publication = await this.publicationRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.pages', 'pages')
      .orderBy('pages.id')
      .where('publication.id = :id', { id })
      .getOne();

    return publication;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const publication = await this.publicationRepository.findOne({
      where: {
        id,
      },
    });

    publication.name = updatePublicationDto.name;
    publication.author = updatePublicationDto.author;

    await this.publicationRepository.save(publication);

    return { publication };
  }

  async updatePage(id: number, pageId: number, updatePageDto: UpdatePageDto) {
    const publication = await this.publicationRepository.findOne({
      where: {
        id,
      },
    });

    const page = publication.pages.find((p) => p.id === pageId);

    if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

    page.name = updatePageDto.name;
    page.areas_json = updatePageDto.areas_json;

    await this.pageRepository.save(page);

    publication.updated_at = new Date();
    await this.publicationRepository.save(publication);

    await this.generateManifest(id);

    return { page };
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }

  async generateManifest(id: number) {
    const publication = await this.publicationRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.pages', 'pages')
      .orderBy('pages.id')
      .where('publication.id = :id', { id })
      .getOne();

    mkdirSync(`./public/manifests`, { recursive: true });

    writeFileSync(
      `./public/manifests/${publication.id}.json`,
      JSON.stringify(publication),
    );
  }
}
