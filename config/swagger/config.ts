import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default class SwaggerConfig {
  async set(app: any) {
    const options = new DocumentBuilder()
      .setTitle('<API Title>')
      .setDescription('<API Description>')
      .setVersion('1.0')
      .addTag('<API Tag>')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }
}
