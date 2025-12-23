const crypto = require('crypto');
const mongoose = require('mongoose');
const Manuscript = require('../models/Manuscript');
const emailService = require('../services/emailService');
const config = require('../config/env');

// Verifies a payment server-side and publishes the manuscript in a transaction
exports.verifyPayment = async (req, res) => {
  try {
    const { manuscriptId, paymentId, amount, status, metadata, signature } = req.body;

    if (!manuscriptId || !paymentId || typeof amount === 'undefined' || !status) {
      return res.status(400).json({ success: false, message: 'Missing payment data' });
    }

    // Support Razorpay callback verification if razorpay fields present
    // If razorpay_order_id and razorpay_signature are provided, verify with RAZORPAY_KEY_SECRET
    const razorpayOrderId = req.body.razorpay_order_id;
    const razorpayPaymentId = req.body.razorpay_payment_id;
    const razorpaySignature = req.body.razorpay_signature;

    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || config.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return res.status(400).json({ success: false, message: 'Razorpay secret not configured' });
      }
      const generated = crypto.createHmac('sha256', keySecret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');
      if (generated !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Invalid Razorpay signature' });
      }
      // treat as confirmed
    } else {
      // Verify signature if PAYMENT_SECRET is configured (legacy)
      const secret = process.env.PAYMENT_SECRET || config.PAYMENT_SECRET;
      if (secret) {
        const payload = `${manuscriptId}|${paymentId}|${amount}|${status}`;
        const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        if (!signature || signature !== expected) {
          return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
      }
    }

    // Debug: log incoming payload (helps diagnose signature/ID mismatches)
    console.log('VerifyPayment payload received:', JSON.stringify(req.body));

    // Find manuscript and match pending payment
    const manuscript = await Manuscript.findById(manuscriptId);
    if (!manuscript) return res.status(404).json({ success: false, message: 'Manuscript not found' });
    // Stored payment records use the Razorpay ORDER id (data.id) as `paymentId` when created.
    // The client may send either the razorpay_order_id (order) or razorpay_payment_id (payment).
    const pending = (manuscript.payments || []).find(p => (
      (paymentId && p.paymentId === paymentId) ||
      (razorpayOrderId && p.paymentId === razorpayOrderId)
    ) && p.status === 'pending');
    if (!pending) {
      // Allow idempotent processing: if already processed, return current status
      const already = (manuscript.payments || []).find(p => p.paymentId === paymentId);
      if (already && already.status === 'confirmed') {
        return res.json({ success: true, message: 'Payment already confirmed' });
      }
      return res.status(400).json({ success: false, message: 'Pending payment not found' });
    }

    // Perform transactional update: mark payment and publish manuscript on success
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // update payment entry
      pending.status = status;
      pending.timestamp = new Date();
      pending.metadata = metadata || pending.metadata || {};

      // If confirmed, mark publication
      if (status === 'confirmed' || status === 'success' || status === 'paid') {
        manuscript.publicationCharges.isPaid = true;
        manuscript.publishedAt = new Date();
        manuscript.workflowStatus = 'PUBLISHED';
        manuscript.status = 'published';
      } else {
        // failed or other statuses
        manuscript.publicationCharges.isPaid = false;
      }

      await manuscript.save({ session });

      await session.commitTransaction();
      session.endSession();
    } catch (txErr) {
      await session.abortTransaction();
      session.endSession();
      throw txErr;
    }

    // Notify author depending on result
    const authorEmail = manuscript.correspondingAuthor?.email || manuscript.correspondingAuthor;
    if (status === 'confirmed' || status === 'success' || status === 'paid') {
      try {
        await emailService.notifyAuthorPaymentConfirmed(authorEmail, manuscript, pending);
      } catch (e) {
        console.warn('Payment confirmation email failed', e.message);
      }
      // Notify editor-in-chief(s) about this payment
      try {
        const User = require('../models/User');
        const editors = await User.find({ 'roles.editorInChief': true });
        for (const ed of editors) {
          try {
            await emailService.notifyEditorPaymentReceived(ed.email, manuscript, pending);
          } catch (ee) {
            console.warn('Editor notification failed for', ed.email, ee.message);
          }
        }
      } catch (e) {
        console.warn('Failed to notify editors about payment', e.message);
      }
    } else {
      try {
        await emailService.notifyAuthorPaymentFailed(authorEmail, manuscript, pending);
      } catch (e) {
        console.warn('Payment failure email failed', e.message);
      }
    }

    res.json({ success: true, message: 'Payment processed', data: { manuscript } });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
  }
};

// Create a Razorpay order and return order details to client
exports.createOrder = async (req, res) => {
  try {
    const { manuscriptId } = req.body;
    console.log('Create order request for:', manuscriptId);
    
    if (!manuscriptId) {
      console.log('Missing manuscriptId');
      return res.status(400).json({ success: false, message: 'manuscriptId required' });
    }

    const manuscript = await Manuscript.findById(manuscriptId);
    if (!manuscript) {
      console.log('Manuscript not found:', manuscriptId);
      return res.status(404).json({ success: false, message: 'Manuscript not found' });
    }

    // Recalculate charges based on current pricing (ensures old manuscripts use new rates)
    const pages = manuscript.manuscriptFile?.pages || 1;
    const baseAmount = 5; // Minimum charge
    const extraPages = pages > 6 ? pages - 6 : 0;
    const chargeAmount = baseAmount + (extraPages * 10);
    
    // Update manuscript with recalculated charges
    manuscript.publicationCharges = {
      baseAmount,
      extraPages,
      totalAmount: chargeAmount
    };
    await manuscript.save();

    const keyId = process.env.RAZORPAY_KEY_ID || config.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || config.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error('Razorpay keys not configured');
      return res.status(500).json({ success: false, message: 'Razorpay keys not configured' });
    }

    const amount = Math.round(chargeAmount * 100); // paise
    console.log('Recalculated payment amount:', chargeAmount, '=> paise:', amount);
    
    if (amount <= 0) {
      console.log('Invalid amount:', amount);
      return res.status(400).json({ success: false, message: 'Invalid publication amount' });
    }

    // Create order via Razorpay REST API
    let response;
    try {
      response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
        },
        body: JSON.stringify({ amount, currency: 'INR', receipt: `rcpt_${manuscriptId}`, payment_capture: 1 })
      });
    } catch (fetchErr) {
      console.error('Razorpay fetch failed:', fetchErr.message);
      return res.status(503).json({ success: false, message: 'Unable to reach payment service', error: fetchErr.message });
    }

    if (!response.ok) {
      const text = await response.text();
      console.error(`Razorpay API error (${response.status}):`, text);
      return res.status(response.status === 401 ? 401 : 400).json({ 
        success: false, 
        message: 'Razorpay order creation failed', 
        detail: text.substring(0, 200) 
      });
    }

    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      console.error('Failed to parse Razorpay response:', parseErr.message);
      return res.status(502).json({ success: false, message: 'Invalid response from payment service' });
    }

    if (!data.id) {
      console.error('Razorpay response missing order id:', data);
      return res.status(502).json({ success: false, message: 'Invalid order response from payment service' });
    }

    console.log('Successfully created Razorpay order:', data.id);

    // store order id as pending payment record
    const payment = {
      paymentId: data.id,
      amount: manuscript.publicationCharges.totalAmount || 0,
      timestamp: new Date(),
      status: 'pending',
      metadata: { razorpay: data }
    };

    manuscript.payments = manuscript.payments || [];
    manuscript.payments.push(payment);
    manuscript.workflowStatus = 'PAYMENT_PENDING';
    await manuscript.save();

    res.json({ success: true, data: { order: data, keyId } });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
  }
};
