import { Controller, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { OrdersService } from '@/api/orders/services';
import { Order } from '@/api/orders/entities';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Capture a PayPal order by its ID and mark it as completed
   * @param paypalOrderId PayPal order ID to capture
   * @returns The completed order along with the PayPal capture result
   */
  @Post('capture/:paypalOrderId')
  @ApiOperation({ summary: 'Capture a PayPal order' })
  @ApiParam({
    name: 'paypalOrderId',
    description: 'ID of the PayPal order to capture',
  })
  @ApiResponse({
    status: 201,
    description: 'Order successfully captured and marked as completed',
    type: Order,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found with given PayPal ID',
  })
  async capture(@Param('paypalOrderId') paypalOrderId: string) {
    return await this.ordersService.completePaypalOrder(paypalOrderId);
  }
}
