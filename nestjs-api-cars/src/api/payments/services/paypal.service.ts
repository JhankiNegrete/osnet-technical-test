import { Injectable } from '@nestjs/common';
import * as checkoutNodeJssdk from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
  private client: checkoutNodeJssdk.core.PayPalHttpClient;

  constructor() {
    const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!,
    );
    this.client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
  }

  async createOrder(total: number, currency = 'USD') {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: total.toFixed(2),
          },
        },
      ],
    });

    const response = await this.client.execute(request);
    return response.result;
  }

  async captureOrder(orderId: string) {
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);

    request.requestBody({} as any);

    const response = await this.client.execute(request);
    return response.result;
  }
}
