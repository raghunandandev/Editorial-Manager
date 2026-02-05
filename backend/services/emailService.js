const nodemailer = require('nodemailer');
const config = require('../config/env');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: false,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS
  }
});

exports.notifyNewSubmission = async (editorEmail, manuscript) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: editorEmail,
    subject: 'New Manuscript Submission',
    html: `
      <h2>New Manuscript Submitted</h2>
      <p><strong>Title:</strong> ${manuscript.title}</p>
      <p><strong>Domain:</strong> ${manuscript.domain}</p>
      <p><strong>Submitted Date:</strong> ${manuscript.submissionDate}</p>
      <p>Please log in to the editorial system to review this submission.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyReviewAssignment = async (reviewerEmail, manuscript, assignment) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: reviewerEmail,
    subject: 'Review Assignment',
    html: `
      <h2>New Review Assignment</h2>
      <p><strong>Manuscript Title:</strong> ${manuscript.title}</p>
      <p><strong>Due Date:</strong> ${assignment.dueDate.toDateString()}</p>
      <p>Please log in to the editorial system to accept this assignment and submit your review.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyAuthorRevision = async (authorEmail, manuscript, review) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: authorEmail,
    subject: 'Revision Required for Your Manuscript',
    html: `
      <h2>Revision Required</h2>
      <p>Your manuscript "${manuscript.title}" requires revisions.</p>
      <p><strong>Reviewer Comments:</strong></p>
      <p>${review.commentsToAuthor}</p>
      <p>Please log in to submit your revised manuscript.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyReviewAssignmentAccepted = async (editorId, manuscript, reviewer) => {
  const editor = await User.findById(editorId);
  
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: editor.email,
    subject: 'Review Assignment Accepted',
    html: `
      <h2>Review Assignment Accepted</h2>
      <p><strong>Reviewer:</strong> ${reviewer.firstName} ${reviewer.lastName}</p>
      <p><strong>Manuscript:</strong> ${manuscript.title}</p>
      <p>The reviewer has accepted the assignment and will submit their review by the due date.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyReviewAssignmentDeclined = async (editorId, manuscript, reviewer, reason) => {
  const editor = await User.findById(editorId);
  
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: editor.email,
    subject: 'Review Assignment Declined',
    html: `
      <h2>Review Assignment Declined</h2>
      <p><strong>Reviewer:</strong> ${reviewer.firstName} ${reviewer.lastName}</p>
      <p><strong>Manuscript:</strong> ${manuscript.title}</p>
      <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
      <p>Please assign another reviewer for this manuscript.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyReviewSubmitted = async (editorId, manuscript, review) => {
  const editor = await User.findById(editorId);
  
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: editor.email,
    subject: 'Review Submitted',
    html: `
      <h2>New Review Submitted</h2>
      <p><strong>Manuscript:</strong> ${manuscript.title}</p>
      <p><strong>Recommendation:</strong> ${review.recommendation}</p>
      <p><strong>Overall Score:</strong> ${review.overallScore.toFixed(2)}/5</p>
      <p>Please log in to view the complete review and make a decision.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyNewQuery = async (editorEmail, query) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: editorEmail,
    subject: 'New Help / Query Submitted',
    html: `
      <h2>New Query Submitted</h2>
      <p><strong>Name:</strong> ${query.name}</p>
      <p><strong>Email:</strong> ${query.email}</p>
      <p><strong>Message:</strong></p>
      <p>${query.message}</p>
      <p>Submitted at: ${query.createdAt || new Date().toISOString()}</p>
      <p>Please log in to the editorial system to respond.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.sendQueryReply = async (userEmail, reply, originalQuery) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: userEmail,
    subject: 'Response to Your Query',
    html: `
      <h2>Response from Editor</h2>
      <p><strong>Your original query:</strong></p>
      <p>${originalQuery.message}</p>
      <hr/>
      <p><strong>Editor's response:</strong></p>
      <p>${reply}</p>
      <p>If you need further assistance reply to this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyAuthorPaymentRequest = async (authorEmail, manuscript, payment) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: authorEmail,
    subject: 'Publication Fee Request',
    html: `
      <h2>Publication Fee Request</h2>
      <p>Your manuscript "${manuscript.title}" has been accepted by the editorial office.</p>
      <p><strong>Amount:</strong> ${payment.amount}</p>
      <p>Please complete the payment to proceed with publishing. You will receive a confirmation once payment is verified.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyAuthorPaymentConfirmed = async (authorEmail, manuscript, payment) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: authorEmail,
    subject: 'Payment Confirmed - Manuscript Published',
    html: `
      <h2>Payment Confirmed</h2>
      <p>Your payment for manuscript "${manuscript.title}" has been received and verified.</p>
      <p>The manuscript is now published and available publicly.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyAuthorPaymentFailed = async (authorEmail, manuscript, payment) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: authorEmail,
    subject: 'Payment Failed',
    html: `
      <h2>Payment Failed</h2>
      <p>We were unable to verify your payment for manuscript "${manuscript.title}". Please try again or contact support.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.notifyEditorPaymentReceived = async (editorEmail, manuscript, payment) => {
  const mailOptions = {
    from: config.FROM_EMAIL,
    to: editorEmail,
    subject: 'Payment Received for Manuscript',
    html: `
      <h2>Payment Received</h2>
      <p>A payment has been received for manuscript "${manuscript.title}".</p>
      <p><strong>Amount:</strong> ${payment.amount}</p>
      <p><strong>Payer:</strong> ${manuscript.correspondingAuthor?.email || 'Unknown'}</p>
      <p>Please log in to review the manuscript status.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};