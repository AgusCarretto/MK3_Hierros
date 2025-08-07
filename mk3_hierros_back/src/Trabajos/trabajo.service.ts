import { Injectable } from '@nestjs/common';




@Injectable()
export class TrabajoService {
  getHello(): string {
    return 'Hello World!';
  }
}
