import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthTokenDtoV1 } from './dto/auth-token.dto';
import { Token } from './entities';

@Injectable()
export class TokenServiceV1 {
  constructor(
    @InjectRepository(Token) private tokenRepoSitory: Repository<Token>,
  ) {}
  async create(tokenDto: AuthTokenDtoV1): Promise<Token> {
    try {
      const token = this.tokenRepoSitory.create(tokenDto);
      await this.tokenRepoSitory.save(token);
      return token;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async fetchAllTokensForAUser(userId: number): Promise<Token[]> {
    const tokens = await this.tokenRepoSitory.findBy({
      user: { id: userId },
    });
    return tokens;
  }

  async remove(userId: number, accessToken: string) {
    try {
      const token = await this.tokenRepoSitory.findOneByOrFail({
        user: { id: userId },
        accessToken: accessToken,
      });
      await this.tokenRepoSitory.remove(token);
    } catch (err) {
      throw new NotFoundException(
        'No entry found matching the requsted Combination',
      );
    }
  }
}
