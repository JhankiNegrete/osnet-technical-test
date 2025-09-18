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

  /**
   * Create a PayPal order
   * @param total Total amount of the order
   * @param currency Currency code (default: USD)
   * @returns PayPal order object containing ID and approval links
   */
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

  /**
   * Capture a previously created PayPal order
   * @param orderId PayPal order ID to capture
   * @returns Capture result from PayPal including payment status and details
   */
  async captureOrder(orderId: string) {
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);

    // The SDK requires a requestBody, even if empty
    request.requestBody({} as any);

    const response = await this.client.execute(request);
    return response.result;
  }
}
