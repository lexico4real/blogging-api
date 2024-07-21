import { Module } from '@nestjs/common';
import RandomCode from 'common/util/random-code';
import { BarcodeController } from './barcode.controller';
import { BarcodeService } from './barcode.service';

@Module({
  controllers: [BarcodeController],
  providers: [BarcodeService, RandomCode],
})
export class BarcodeModule {}
