import { forwardRef, Module } from '@nestjs/common';
import { PaypalService } from './services';
import { PaymentsController } from './controllers';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  controllers: [PaymentsController],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaymentsModule {}
