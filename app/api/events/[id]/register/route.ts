import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe';

const prisma = new PrismaClient()

// Stripe is initialized inside the handler to ensure environment variables are loaded.
let stripe: Stripe | null = null;

const getStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any });
  }
  return stripe;
};

async function sendSplitInviteEmail(email: string, eventName: string, inviterName: string, paymentUrl: string) {
  const RESEND_API_KEY = 're_bMRDW2sy_3fqo2Y1w6qmUnfmRpDJzUVrz';
  const FROM_EMAIL = 'noreply@eventmashups.com';
  const subject = `You're invited to split payment for ${eventName}`;
  const text = `${inviterName} has invited you to split the cost for the event "${eventName}". Pay your share here: ${paymentUrl}`;
  const html = `<p>${inviterName} has invited you to split the cost for the event <b>${eventName}</b>.</p><p>Pay your share here: <a href="${paymentUrl}">${paymentUrl}</a></p>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
      text,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const { name, email, splitCost, splitCount, splitEmails } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // Find event for price
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { name, email, password: '', role: 'USER' } });
    }

    // Check for existing RSVP
    const existing = await prisma.rSVP.findFirst({ where: { userId: user.id, eventId } });
    if (existing) {
      return NextResponse.json({ message: 'You have already registered for this event.' }, { status: 200 });
    }

    // Calculate split amount
    let amount = event.price;
    let splitInviteIds: string[] = [];
    if (splitCost && splitCount && splitCount > 1) {
      amount = event.price / splitCount;
      // Store split invites for other emails
      if (Array.isArray(splitEmails)) {
        for (const inviteEmail of splitEmails) {
          if (inviteEmail && inviteEmail !== email) {
            const splitInvite = await prisma.splitInvite.create({
              data: {
                eventId,
                inviterId: user.id,
                inviteeEmail: inviteEmail,
                status: 'PENDING',
              },
            });
            splitInviteIds.push(splitInvite.id);
            // Send email invite with payment link
            const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}/pay/${splitInvite.id}`;
            await sendSplitInviteEmail(inviteEmail, event.name, user.name, paymentUrl);
          }
        }
      }
    }

    const stripe = getStripe();

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.name,
              description: event.description,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}?canceled=1`,
      metadata: {
        eventId,
        userId: user.id,
        splitCost: splitCost ? 'true' : 'false',
        splitInviteIds: splitInviteIds.join(','),
      },
    });

    // RSVP is only confirmed after payment, so don't create RSVP yet
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
} 