import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import User from '../models/User';
import { authenticate } from '../middleware/auth';
import { validate, registerSchema, loginSchema } from '../middleware/validation';

const router = express.Router();

// Register
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create JWT
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled
      }
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password, token: mfaToken } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check MFA if enabled
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return res.status(400).json({ message: 'MFA token required' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret || '',
        encoding: 'base32',
        token: mfaToken
      });

      if (!verified) {
        return res.status(400).json({ message: 'Invalid MFA token' });
      }
    }

    // Create JWT
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled
      }
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || '') as any;
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Create new JWT
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled
      }
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Setup MFA
router.post('/setup-mfa', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `MultiLink Platform (${user.email})`,
      issuer: 'MultiLink Platform'
    });

    // Save secret to user
    user.mfaSecret = secret.base32;
    await user.save();

    res.json({
      success: true,
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Verify MFA
router.post('/verify-mfa', authenticate, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user?.id);
    
    if (!user || !user.mfaSecret) {
      return res.status(404).json({ message: 'MFA not set up' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid MFA token' });
    }

    // Enable MFA
    user.mfaEnabled = true;
    await user.save();

    res.json({
      success: true,
      message: 'MFA enabled successfully'
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Disable MFA
router.post('/disable-mfa', authenticate, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user?.id);
    
    if (!user || !user.mfaSecret) {
      return res.status(404).json({ message: 'MFA not set up' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid MFA token' });
    }

    // Disable MFA
    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'MFA disabled successfully'
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
