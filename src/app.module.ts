import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from 'config/typeorm';
import { StartTimeMiddleware } from 'common/middlewares/startTime.middleware';
import { BullModule } from '@nestjs/bullmq';
import { MailModule } from './modules/mail/mail.module';
import { PostCategoryModule } from 'modules/post-category/post-category.module';
import { PostModule } from 'modules/post/post.module';
import { CommentModule } from 'modules/comment/comment.module';
import cloudinaryConfig from 'config/cloudinary.config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm, cloudinaryConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> =>
        (await configService.get('typeorm')) as TypeOrmModuleOptions,
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailModule,
    PostCategoryModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StartTimeMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
