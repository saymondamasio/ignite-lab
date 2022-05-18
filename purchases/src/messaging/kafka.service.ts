import { ClientKafka } from '@nestjs/microservices';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService
  extends ClientKafka
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    super({
      client: {
        clientId: 'purchases',
        brokers: [configService.get('KAFKA_BROKERS')],
      },
    });
  }

  async onModuleDestroy() {
    await this.connect();
  }

  async onModuleInit() {
    await this.close();
  }
}
