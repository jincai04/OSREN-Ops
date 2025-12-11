const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'myr' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ToyyibPay placeholder - would need actual integration
router.post('/create-bill', async (req, res) => {
  try {
    // Placeholder for ToyyibPay integration
    const { amount, name, email, phone } = req.body;

    // In real implementation, call ToyyibPay API
    const bill = {
      id: 'BILL_' + Date.now(),
      url: `https://toyyibpay.com/${process.env.TOYYIBPAY_CATEGORY_CODE}?amount=${amount}`,
      status: 'pending',
    };

    res.json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
