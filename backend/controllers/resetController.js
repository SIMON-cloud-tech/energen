// controllers/resetController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OtpStore = require('../models/otpStore');
const { sendOTPEmail } = require('../utils/sendEmail');

const MAX_ATTEMPTS = 5;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ========== 1. SEND OTP ==========
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return the same success message whether or not the account exists —
    // otherwise this endpoint becomes a tool for checking who has an account.
    if (!user) {
      return res.json({ message: 'If that email is registered, a code has been sent.' });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_TTL_MS;

    await OtpStore.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, expiresAt, attempts: 0 }, // reset attempts on every new OTP
      { upsert: true, new: true }
    );

    await sendOTPEmail(normalizedEmail, otp, 'password reset');

    // Never echo the OTP back in the response or logs in production.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📧 OTP for ${normalizedEmail}: ${otp}`);
    }

    res.json({ message: 'If that email is registered, a code has been sent.' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== 2. VERIFY OTP ==========
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const normalizedEmail = email.toLowerCase().trim();
    const record = await OtpStore.findOne({ email: normalizedEmail });

    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (Date.now() > record.expiresAt) {
      await OtpStore.deleteOne({ email: normalizedEmail });
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await OtpStore.deleteOne({ email: normalizedEmail });
      return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
    }

    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.json({ message: 'Code verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== 3. RESET PASSWORD (re-verifies OTP server-side) ==========
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = await OtpStore.findOne({ email: normalizedEmail });

    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (Date.now() > record.expiresAt) {
      await OtpStore.deleteOne({ email: normalizedEmail });
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (record.attempts >= MAX_ATTEMPTS) {
      await OtpStore.deleteOne({ email: normalizedEmail });
      return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
    }
    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email: normalizedEmail }, { password: hashedPassword });

    // Delete OTP immediately — it must be single-use, not reusable until expiry.
    await OtpStore.deleteOne({ email: normalizedEmail });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};