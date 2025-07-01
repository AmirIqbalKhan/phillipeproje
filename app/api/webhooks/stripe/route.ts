import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.arrayBuffer();
  let event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const eventId = session.metadata?.eventId;
    const userId = session.metadata?.userId;
    const splitInviteIds = session.metadata?.splitInviteIds ? session.metadata.splitInviteIds.split(',') : [];
    try {
      // Create RSVP for the user
      if (eventId && userId) {
        await prisma.rSVP.create({
          data: {
            userId,
            eventId,
            status: 'CONFIRMED',
          },
        });
      }
      // Mark split invites as PAID
      if (splitInviteIds.length > 0) {
        for (const id of splitInviteIds) {
          await prisma.splitInvite.update({
            where: { id },
            data: { status: 'PAID', stripeSessionId: session.id, stripePaymentIntentId: session.payment_intent as string },
          });
        }
      }
    } catch (err) {
      return NextResponse.json({ error: 'Failed to process RSVP or split invite.' }, { status: 500 });
    }
  }
  return NextResponse.json({ received: true });
} 