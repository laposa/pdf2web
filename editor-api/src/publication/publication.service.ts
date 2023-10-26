import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Page } from "src/publication/entities/page.entity";
import { convert } from "src/publication/lib/pdf-to-images";
import { Publication } from "src/publication/entities/publication.entity";
import { CreatePublicationDto } from "src/publication/dto/create-publication.dto";
import { UpdatePublicationDto } from "src/publication/dto/update-publication.dto";
import { UpdatePageDto } from "src/publication/dto/update-page.dto";

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
    // TODO: is there a simpler way to order relationships?
    // order the pages by id
    const publication = await this.publicationRepository
      .createQueryBuilder("publication")
      .leftJoinAndSelect("publication.pages", "pages")
      .orderBy("pages.id")
      .where("publication.id = :id", { id })
      .getOne();

    return publication;
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  async generate(id: number, file: Express.Multer.File) {
    const publication = await this.publicationRepository.findOne({
      where: {
        id,
      },
    });

    const paths = await convert(publication, file);

    if (publication.pages.length > 0) {
      await this.pageRepository.delete(publication.pages.map((p) => p.id));
    }

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

  async updatePage(id: number, pageId: number, updatePageDto: UpdatePageDto) {
    const publication = await this.publicationRepository.findOne({
      where: {
        id,
      },
    });

    const page = publication.pages.find((p) => p.id === pageId);

    if (!page) throw new HttpException("Page not found", HttpStatus.NOT_FOUND);

    page.name = updatePageDto.name;
    page.areas_json = updatePageDto.areas_json;

    await this.pageRepository.save(page);

    return { page };
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
