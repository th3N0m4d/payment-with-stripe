import Stripe from "stripe";
import { APIGatewayProxyEventV2, APIGatewayProxyEvent } from "aws-lambda";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const checkout = async (
  event: APIGatewayProxyEventV2 | APIGatewayProxyEvent
) => {
  const { amount, currency } = JSON.parse(event.body || "{}");

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error(message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: message }),
    };
  }
};
