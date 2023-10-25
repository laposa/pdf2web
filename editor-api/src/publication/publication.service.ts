import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Page } from "src/publication/entities/page.entity";
import { convert } from "src/publication/lib/pdf-to-images";
import { Publication } from "src/publication/entities/publication.entity";
import { CreatePublicationDto } from "src/publication/dto/create-publication.dto";
import { UpdatePublicationDto } from "src/publication/dto/update-publication.dto";

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>
  ) {}

  async create(CreatePublicationDto: CreatePublicationDto) {
    const publication = new Publication();
    publication.title = CreatePublicationDto.title;

    this.publicationRepository.save(publication);
    return { publication };
  }

  async findAll(): Promise<Publication[]> {
    return await this.publicationRepository.find({});
  }

  async findOne(id: number) {
    return await this.publicationRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  async generate(id: number) {
    const publication = await this.publicationRepository.findOne({
      where: {
        id,
      },
    });

    const paths = await convert(publication);

    for (const path of paths) {
      const pageData = new Page();
      pageData.name = `Page`;
      pageData.filename = path;

      const page = await this.pageRepository.save(pageData);
      await publication.pages.push(page);
    }

    await this.publicationRepository.save(publication);

    return { publication };
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
