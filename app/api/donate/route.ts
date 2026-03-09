import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, email } = await req.json();

    if (!amount || !email) {
      return NextResponse.json({ error: 'Amount and email are required' }, { status: 400 });
    }

    // Convert amount to kobo (Paystack uses kobo for NGN)
    const amountInKobo = Math.round(amount * 100);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInKobo,
        email,
        currency: 'NGN',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation/success`,
        metadata: {
          type: 'donation',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message }, { status: response.status });
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }
}