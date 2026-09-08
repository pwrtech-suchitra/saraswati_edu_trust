/**
 * Gateway Webhooks Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const paymentService = require('../services/paymentService');
const ApiResponse = require('../utils/apiResponse');

async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const result = await paymentService.processGatewayWebhook({
      rawBody: req.rawBody || req.body,
      signature,
      payload: req.body
    });

    return ApiResponse.success(res, 'Webhook event processed', result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleWebhook
};
