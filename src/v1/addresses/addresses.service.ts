import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

import {
  ConditionAddressDtoV1,
  CreateAddressDtoV1,
  UpdateAddressDtoV1,
} from '@/src/v1/addresses/dto';
import { Address } from '@/src/v1/addresses/entities';
import { UsersServiceV1 } from '@/src/v1/users/users.service';

@Injectable()
export class AddressesServiceV1 {
  constructor(
    @InjectRepository(Address) private addressesRepository: Repository<Address>,
    private readonly usersService: UsersServiceV1,
  ) {}

  async create(userId: number, createAddressDto: CreateAddressDtoV1) {
    try {
      const isAddressExists = await this.exists({ user: { id: userId } });
      if (isAddressExists) {
        throw new BadRequestException(
          `Address already exists for userId: ${userId}`,
        );
      }
      const user = await this.usersService.findOne({ id: userId });
      const address = this.addressesRepository.create({
        ...createAddressDto,
        user,
      });
      await this.addressesRepository.save(address);
      return address;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(userId: number, select: FindOptionsSelect<Address> = {}) {
    try {
      const address = await this.addressesRepository.findOneOrFail({
        where: { user: { id: userId } },
        select,
      });
      return address;
    } catch (err) {
      throw new NotFoundException('Invalid data');
    }
  }

  async update(userId: number, updateAddressDto: UpdateAddressDtoV1) {
    try {
      const updatedRes = await this.addressesRepository.update(
        { user: { id: userId } },
        updateAddressDto,
      );
      if (!updatedRes.affected) {
        throw new NotFoundException('Invalid data');
      }
      const data = await this.findOne(userId);
      return data;
    } catch (err) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(userId: number) {
    try {
      const address = await this.findOne(userId);
      const deletedAddress = await this.addressesRepository.remove(address);
      return deletedAddress;
    } catch (err) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async exists(conditions: ConditionAddressDtoV1) {
    const isExists = await this.addressesRepository.existsBy(conditions);
    return isExists;
  }
}
