import { Controller, Get } from '@nestjs/common';
import { BarcodeService } from './barcode.service';

@Controller('qrcode')
export class BarcodeController {
  constructor(private readonly qrService: BarcodeService) {}

  @Get('generate')
  async generateQRCode(): Promise<any> {
    return await this.qrService.generateQRCode();
  }

  @Get('download')
  async downloadQRCode(): Promise<any> {
    return await this.qrService.downloadQRCode();
  }
}
