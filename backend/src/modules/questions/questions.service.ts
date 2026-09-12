import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../database/entities/question.entity';
import { Product } from '../../database/entities/product.entity';
import { CreateQuestionDto, AnswerQuestionDto } from './dto/question.dto';
import { PaginationDto, paginate, PaginatedResult, skipOf } from "../../common/dto/pagination.dto";
import { RedisService } from '../../redis/redis.service';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private readonly questions: Repository<Question>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    private readonly redis: RedisService,
  ) {}

  async listByProduct(productId: string, pagination: PaginationDto): Promise<PaginatedResult<Question>> {
    const qb = this.questions
      .createQueryBuilder('q')
      .where('q.productId = :id', { id: productId })
      .orderBy('q.createdAt', 'DESC')
      .skip(skipOf(pagination))
      .take(pagination.limit);
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, pagination);
  }

  async create(
    productId: string,
    dto: CreateQuestionDto,
    user: { id: string; name: string; avatar?: string | null },
  ): Promise<Question> {
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    const q = this.questions.create({
      productId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar ?? null,
      question: dto.question,
    });
    const saved = await this.questions.save(q);
    await this.redis.del(`product:slug:${product.slug}`);
    return saved;
  }

  async answer(
    id: string,
    dto: AnswerQuestionDto,
    user: { id: string; name: string; role: UserRole },
  ): Promise<Question> {
    const q = await this.questions.findOne({ where: { id }, relations: ['product'] });
    if (!q) throw new NotFoundException('Question not found');

    // Only author OR admin can answer
    const isAuthor = q.product?.authorId === user.id;
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('Only the product author or an admin can answer this question');
    }

    q.answer = dto.answer;
    q.answeredBy = dto.answeredBy ?? user.name;
    q.answerDate = new Date();
    const saved = await this.questions.save(q);
    await this.redis.del(`product:slug:${q.product?.slug}`);
    return saved;
  }

  async remove(id: string, userId: string, role: UserRole): Promise<{ message: string }> {
    const q = await this.questions.findOne({ where: { id }, relations: ['product'] });
    if (!q) throw new NotFoundException('Question not found');
    const isOwner = q.userId === userId;
    const isAuthor = q.product?.authorId === userId;
    const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
    if (!isOwner && !isAuthor && !isAdmin) {
      throw new ForbiddenException('Not allowed to delete this question');
    }
    await this.questions.remove(q);
    await this.redis.del(`product:slug:${q.product?.slug}`);
    return { message: 'Question deleted' };
  }
}
