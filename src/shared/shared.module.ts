import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';
import {
  CommonService,
  CustomConfigService,
} from './services';

const providers = [
  CustomConfigService,
  CommonService,
];

@Global()
@Module({
  imports: [HttpModule],
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
