import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { Serializer } from '@/src/common/decorators';
import { IResponse } from '@/src/common/interfaces';
import { AddressesServiceV1 } from '@/src/v1/addresses/addresses.service';
import {
  CreateAddressDtoV1,
  ResAddressDtoV1,
  UpdateAddressDtoV1,
} from '@/src/v1/addresses/dto';
import { Address } from '@/src/v1/addresses/entities';
import { AuthenticationV1 } from '@/src/v1/auth/decorators';

@Serializer(ResAddressDtoV1)
@AuthenticationV1()
@Controller({ path: 'users/:userId/address', version: '1' })
// @UseInterceptors(CacheInterceptor)
export class AddressesControllerV1 {
  constructor(private readonly addressesService: AddressesServiceV1) {}

  @Post()
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createAddressDto: CreateAddressDtoV1,
  ): Promise<IResponse<Address>> {
    const address = await this.addressesService.create(
      userId,
      createAddressDto,
    );
    return {
      data: address,
      message: 'Address added successfully',
    };
  }

  @Get()
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<IResponse<Address>> {
    const address = await this.addressesService.findOne(userId);
    return { data: address, message: 'Address fetched successfully' };
  }

  @Patch('')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateAddressDto: UpdateAddressDtoV1,
  ): Promise<IResponse<Address>> {
    const updatedAddress = await this.addressesService.update(
      userId,
      updateAddressDto,
    );
    return { data: updatedAddress, message: 'Address updated successfully' };
  }

  @Delete('')
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<IResponse<Address>> {
    const deletedAddress = await this.addressesService.remove(userId);
    return { data: deletedAddress, message: 'Address deleted successfully' };
  }
}
