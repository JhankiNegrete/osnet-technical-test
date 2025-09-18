import { Controller, Post, Param } from '@nestjs/common';
import { OrdersService } from '@/api/orders/services';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('capture/:paypalOrderId')
  async capture(@Param('paypalOrderId') paypalOrderId: string) {
    return await this.ordersService.completePaypalOrder(paypalOrderId);
  }
}
