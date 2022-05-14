import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateCustomerParams {
  authUserId: string;
}

@Injectable()
export class CustomersService {
  constructor(private prismaService: PrismaService) {}

  getCustomerByAuthUserId(authUserId: string) {
    return this.prismaService.customer.findUnique({
      where: {
        authUserId,
      },
    });
  }

  async createCustomer({ authUserId }: CreateCustomerParams) {
    return this.prismaService.customer.create({
      data: {
        authUserId,
      },
    });
  }
}
