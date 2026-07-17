const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../utils/sendEmail');

// Paths
const usersPath = path.join(__dirname, '../data/profile.json');
const otpPath = path.join(__dirname, '../data/otpStore.json');

// Helper: read/write users
const readUsers = () => {
  try {
    if (!fs.existsSync(usersPath)) return [];
    const data = fs.readFileSync(usersPath, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

const writeUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

// Helper: read/write OTP store
const readOtpStore = () => {
  try {
    if (!fs.existsSync(otpPath)) return {};
    const data = fs.readFileSync(otpPath, 'utf8');
    return JSON.parse(data);
  } catch { return {}; }
};

const writeOtpStore = (store) => {
  fs.writeFileSync(otpPath, JSON.stringify(store, null, 2));
};

// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    const otpStore = readOtpStore();
    otpStore[email] = { otp, expiresAt };
    writeOtpStore(otpStore);

    // For development, log OTP and return it in response (remove in production)
    console.log(`📧 OTP for ${email}: ${otp}`);
    //send otp via email to the client
    await sendOTPEmail(email, otp, 'password reset');

    res.json({
      message: 'OTP sent successfully (check console)',
      // Include OTP in response ONLY for testing – remove later
      otp: otp // remove this in production
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const otpStore = readOtpStore();
    const record = otpStore[email];
    if (!record) {
      return res.status(400).json({ message: 'No OTP requested for this email' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      writeOtpStore(otpStore);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark as verified (optional – we can just allow reset after verification)
    // We'll keep the OTP record but we can set a flag – we'll just let the reset endpoint check again.
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. RESET PASSWORD (after OTP verified)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password required' });
    }

    // Verify OTP again
    const otpStore = readOtpStore();
    const record = otpStore[email];
    if (!record) {
      return res.status(400).json({ message: 'No OTP requested for this email' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      writeOtpStore(otpStore);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Update user password
    const users = readUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
    writeUsers(users);

    // Delete OTP after successful reset
    delete otpStore[email];
    writeOtpStore(otpStore);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};