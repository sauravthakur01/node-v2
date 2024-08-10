import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CalcModule } from './calc/calc.module';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [CalcModule],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }

}
