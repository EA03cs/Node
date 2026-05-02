/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                     🛠️  MY PROJECT UTILS                                 ║
 * ║            كل الـ utilities في ملف واحد جاهز للاستخدام                  ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 *  ملف شخصي — ضيفه في أي بروجيكت Node.js/Express
 *
 *  الأقسام:
 *  1.  asyncHandler
 *  2.  AppError
 *  3.  sendSuccess / sendError
 *  4.  Hash (bcrypt)
 *  5.  JWT (access + refresh)
 *  6.  Crypto AES Encrypt/Decrypt
 *  7.  Email (nodemailer + templates)
 *  8.  Cloudinary Upload/Delete
 *  9.  REGEX patterns
 *  10. Validation Middleware (Joi)
 *  11. Authorize (Role-based)
 *  12. nanoid OTP/Code generator
 *  13. Date helpers
 *  14. Pagination helper
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import Joi from 'joi';
import { customAlphabet } from 'nanoid';

// ─────────────────────────────────────────────────────────────────────────────
// 1. ASYNC HANDLER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * بيلف أي async controller ويبعت الـ error لـ next تلقائياً
 * بدل try/catch في كل controller
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ─────────────────────────────────────────────────────────────────────────────
// 2. APP ERROR CLASS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom error class للـ operational errors
 * الفرق عن Error العادية: بيحط statusCode و isOperational
 *
 * @example
 * throw new AppError('User not found', 404);
 * return next(new AppError('Unauthorized', 401));
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // operational = expected error, not a bug
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESPONSE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * إرسال response ناجح بشكل موحد
 * @param {object} res - Express response object
 * @param {object} options
 * @param {number} [options.statusCode=200]
 * @param {string} [options.message='Success']
 * @param {*}      [options.data={}]
 *
 * @example
 * sendSuccess(res, { statusCode: 201, message: 'User created', data: { user } });
 */
export const sendSuccess = (res, { statusCode = 200, message = 'Success', data = {} } = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Global Error Handler Middleware — ضيفه آخر middleware في app.js
 *
 * @example
 * // في app.js
 * app.use(globalErrorHandler);
 */
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(422).json({ success: false, message });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ success: false, message: 'Invalid token' });

  if (err.name === 'TokenExpiredError')
    return res.status(401).json({ success: false, message: 'Token expired' });

  // Cast Error (invalid MongoDB ID)
  if (err.name === 'CastError')
    return res.status(400).json({ success: false, message: 'Invalid ID format' });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. HASH UTILS (bcrypt)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @param {number} [saltRounds=12] - Higher = slower but safer
 * @returns {Promise<string>} Hashed password
 *
 * @example
 * const hashed = await hashPassword('MyPass123');
 */
export const hashPassword = async (password, saltRounds = 12) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain password with hashed one
 * @param {string} plain - Plain text password from user
 * @param {string} hashed - Hashed password from DB
 * @returns {Promise<boolean>}
 *
 * @example
 * const isMatch = await comparePassword('MyPass123', user.password);
 * if (!isMatch) return next(new AppError('Invalid credentials', 401));
 */
export const comparePassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. JWT UTILS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate Access Token (short lived)
 * @param {object} payload - Data to sign (e.g. { id, role })
 * @param {string} [expiresIn='15m']
 * @returns {string} JWT token
 *
 * @example
 * const token = generateAccessToken({ id: user._id, role: user.role });
 */
export const generateAccessToken = (payload, expiresIn = '15m') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Generate Refresh Token (long lived)
 * @param {object} payload
 * @param {string} [expiresIn='7d']
 * @returns {string} Refresh JWT token
 */
export const generateRefreshToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
};

/**
 * Verify Access Token
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws Will throw if token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Decode token without verifying (useful for debugging)
 * @param {string} token
 * @returns {object|null}
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CRYPTO AES ENCRYPT / DECRYPT (Symmetric)
// ─────────────────────────────────────────────────────────────────────────────

const ALGORITHM = 'aes-256-cbc';
const CRYPTO_KEY = crypto.scryptSync(
  process.env.CRYPTO_SECRET || 'default_secret_change_me',
  'salt',
  32
);

/**
 * Encrypt text using AES-256-CBC
 * مفيد لتشفير emails أو أي data حساسة في الـ DB
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted string in format: iv:encryptedData
 *
 * @example
 * const encrypted = encryptText('user@gmail.com');
 * // => "a1b2c3...:d4e5f6..."
 */
export const encryptText = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, CRYPTO_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt AES-256-CBC encrypted string
 * @param {string} encryptedText - Format: iv:encryptedData
 * @returns {string} Original plain text
 *
 * @example
 * const original = decryptText(encrypted);
 * // => "user@gmail.com"
 */
export const decryptText = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, CRYPTO_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * Generate a random hex hash (SHA-256) من string
 * مفيد للـ tokens أو checksums
 * @param {string} data
 * @returns {string} hex hash
 */
export const sha256Hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. EMAIL UTILS
// ─────────────────────────────────────────────────────────────────────────────

let _transporter = null;

/**
 * Get or create nodemailer transporter (singleton)
 */
const getTransporter = () => {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });
  }
  return _transporter;
};

/**
 * Send an email
 * @param {object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @returns {Promise}
 *
 * @example
 * await sendEmail({ to: 'user@gmail.com', subject: 'Welcome!', html: '<h1>Hi</h1>' });
 */
export const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"${process.env.APP_NAME || 'MyApp'}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// ─── Email Templates ──────────────────────────────────────────────────────────

/**
 * OTP/Verification Code Email Template
 * @param {string|number} otp - The code to display
 * @param {string} [purpose='Email Verification'] - Why the OTP is being sent
 */
export const otpEmailTemplate = (otp, purpose = 'Email Verification') => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<body style="margin:0;padding:0;background:#0d1117;font-family:Cairo,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#161b22;border:1px solid #30363d;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#1a4024,#0d2044);padding:32px;text-align:center;">
      <h1 style="color:#3fb950;margin:0;font-size:24px;">🔐 ${purpose}</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#8b949e;font-size:15px;margin:0 0 24px;">كود التأكيد الخاص بك:</p>
      <div style="background:#0d1117;border:2px solid #3fb950;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
        <span style="font-size:42px;letter-spacing:12px;color:#58a6ff;font-weight:900;font-family:monospace;">
          ${otp}
        </span>
      </div>
      <p style="color:#8b949e;font-size:13px;">⏱ هذا الكود صالح لمدة <strong style="color:#e3b341;">10 دقائق</strong> فقط</p>
      <p style="color:#484f58;font-size:12px;margin-top:24px;border-top:1px solid #30363d;padding-top:16px;">
        إذا لم تطلب هذا الكود، يمكنك تجاهل هذا البريد الإلكتروني
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Welcome Email Template (after email verification)
 * @param {string} name - User's name
 */
export const welcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<body style="margin:0;padding:0;background:#0d1117;font-family:Cairo,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#161b22;border:1px solid #30363d;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#1a4024,#0d2044);padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">🎉</div>
      <h1 style="color:#3fb950;margin:0;font-size:24px;">أهلاً بك يا ${name}!</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#e6edf3;font-size:16px;">تم تفعيل حسابك بنجاح ✅</p>
      <p style="color:#8b949e;font-size:14px;">يمكنك الآن الاستمتاع بكل خدمات المنصة.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Password Reset Email Template
 * @param {string} resetCode - The reset code/link
 */
export const passwordResetTemplate = (resetCode) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<body style="margin:0;padding:0;background:#0d1117;font-family:Cairo,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#161b22;border:1px solid #30363d;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#3d0f0c,#3d2e00);padding:32px;text-align:center;">
      <h1 style="color:#f85149;margin:0;">🔑 إعادة تعيين كلمة المرور</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#8b949e;">كود إعادة التعيين:</p>
      <div style="background:#0d1117;border:2px solid #f85149;border-radius:12px;padding:24px;text-align:center;">
        <span style="font-size:36px;letter-spacing:10px;color:#f0883e;font-weight:900;font-family:monospace;">
          ${resetCode}
        </span>
      </div>
      <p style="color:#8b949e;font-size:13px;margin-top:16px;">⏱ صالح لمدة <strong style="color:#e3b341;">10 دقائق</strong></p>
    </div>
  </div>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────────────────────
// 8. CLOUDINARY UTILS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialize Cloudinary config
 * استدعيها مرة واحدة في app.js أو config
 */
export const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

/**
 * Upload a file buffer to Cloudinary
 * بتستخدمها بعد multer memoryStorage
 * @param {Buffer} buffer - File buffer from req.file.buffer
 * @param {string} [folder='uploads'] - Cloudinary folder name
 * @returns {Promise<{public_id: string, secure_url: string, ...}>}
 *
 * @example
 * const result = await uploadToCloud(req.file.buffer, 'profiles');
 * user.profileImage = { public_id: result.public_id, secure_url: result.secure_url };
 */
export const uploadToCloud = (buffer, folder = 'uploads') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

/**
 * Upload a file from local path to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} [folder='uploads']
 * @returns {Promise}
 */
export const uploadPathToCloud = async (filePath, folder = 'uploads') => {
  return await cloudinary.uploader.upload(filePath, { folder, resource_type: 'auto' });
};

/**
 * Delete a file from Cloudinary by public_id
 * @param {string} public_id - The Cloudinary public_id
 * @returns {Promise}
 *
 * @example
 * await deleteFromCloud(user.profileImage.public_id);
 */
export const deleteFromCloud = async (public_id) => {
  if (!public_id) return null;
  return await cloudinary.uploader.destroy(public_id);
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. REGEX PATTERNS
// ─────────────────────────────────────────────────────────────────────────────

export const REGEX = {
  /**
   * Full name: "Ahmed Ali" — Capital first letter for each part
   * ✅ "Ahmed Ali"  ❌ "ahmed ali"  ❌ "Ahmed"
   */
  name: /^[A-Z][a-z]{1,19}\s{1}[A-Z][a-z]{1,19}$/,

  /**
   * Username: starts with Arabic or English letter, no dangerous chars
   * ✅ "ahmed_123"  ✅ "أحمد"  ❌ "ahmed#ali"
   */
  userName: /^[a-zA-Z\u0621-\u064A\u0622-\u0626][^#&<>"~;$^%{}?]{1,20}$/,

  /**
   * Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit
   * ✅ "MyPass123"  ❌ "mypassword"  ❌ "12345678"
   */
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,

  /**
   * Egyptian phone numbers: 010, 011, 012, 015 — optional +2 or 002 prefix
   * ✅ "01012345678"  ✅ "+201012345678"  ✅ "00201012345678"
   */
  egyptPhone: /^(002|\+2)?01[0125][0-9]{8}$/,

  /**
   * Email: letters + digits, @ sign, domain ending in .com/.edu/.net
   * ✅ "user@gmail.com"  ❌ "123@gmail.com"  ❌ "user@gmail.org"
   */
  email: /^[a-zA-Z]{1,}\d{0,}[a-zA-Z0-9]{1,}[@][a-z]{1,}(\.com|\.edu|\.net){1,3}$/,

  /**
   * MongoDB ObjectId
   */
  mongoId: /^[a-fA-F0-9]{24}$/,

  /**
   * URL (http/https)
   */
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. VALIDATION MIDDLEWARE (Joi)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Joi validation middleware
 * @param {object} schema - Joi schema object
 * @param {'body'|'params'|'query'} [source='body'] - Where to validate
 * @returns Express middleware
 *
 * @example
 * router.post('/signup', validate(signupSchema), signupController);
 * router.get('/user/:id', validate(idSchema, 'params'), getUser);
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false });

  if (error) {
    const message = error.details.map((d) => d.message.replace(/['"]/g, '')).join(', ');
    return next(new AppError(message, 422));
  }

  req[source] = value; // بيحط الـ sanitized value بدل الـ raw
  next();
};

// ─── Common Joi Schemas ───────────────────────────────────────────────────────

export const schemas = {
  /** تحقق من MongoDB ObjectId */
  mongoId: Joi.object({
    id: Joi.string().pattern(REGEX.mongoId).required().messages({
      'string.pattern.base': 'Invalid ID format',
    }),
  }),

  /** Signup schema */
  signup: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    userName: Joi.string().pattern(REGEX.userName).min(3).max(21).required(),
    email: Joi.string().pattern(REGEX.email).required(),
    password: Joi.string().pattern(REGEX.password).required().messages({
      'string.pattern.base':
        'Password must be at least 8 characters with uppercase, lowercase, and number',
    }),
    phone: Joi.string().pattern(REGEX.egyptPhone).optional(),
  }),

  /** Login schema */
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  /** OTP verify schema */
  verifyOtp: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  }),

  /** Change password schema */
  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(REGEX.password).required(),
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. AUTHORIZE — Role-Based Access Control
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Role-based authorization middleware
 * لازم يجي بعد authenticate middleware
 * @param {...string} roles - Allowed roles
 * @returns Express middleware
 *
 * @example
 * router.delete('/user/:id', authenticate, authorize('admin', 'superAdmin'), deleteUser);
 * router.get('/dashboard', authenticate, authorize('admin'), getDashboard);
 */
export const authorize = (...roles) =>
  (req, res, next) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    if (!roles.includes(req.user.role))
      return next(new AppError(`Access denied. Required roles: ${roles.join(', ')}`, 403));
    next();
  };

/**
 * Check if the authenticated user is the owner of a resource
 * @param {string} resourceUserId - The resource's user id field
 * @returns Express middleware
 *
 * @example
 * router.put('/post/:id', authenticate, isOwner('author'), updatePost);
 */
export const isOwner = (resourceUserIdField = 'userId') =>
  async (req, res, next) => {
    const resource = req.resource; // يتحط قبله في middleware
    if (!resource) return next(new AppError('Resource not found', 404));
    if (resource[resourceUserIdField].toString() !== req.user._id.toString())
      return next(new AppError('You are not the owner', 403));
    next();
  };

// ─────────────────────────────────────────────────────────────────────────────
// 12. OTP / CODE GENERATOR (NanoID)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a numeric OTP (6 digits by default)
 * @param {number} [length=6]
 * @returns {string}
 *
 * @example
 * const otp = generateOtp(); // => "847201"
 * const otp8 = generateOtp(8); // => "38471029"
 */
export const generateOtp = (length = 6) => {
  const nanoid = customAlphabet('0123456789', length);
  return nanoid();
};

/**
 * Generate a random alphanumeric code (uppercase)
 * @param {number} [length=8]
 * @returns {string}
 *
 * @example
 * const code = generateCode(); // => "A3F8B2C1"
 */
export const generateCode = (length = 8) => {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
  return nanoid();
};

/**
 * Generate OTP expiry date
 * @param {number} [minutes=10] - How many minutes until expiry
 * @returns {Date}
 *
 * @example
 * const expiry = generateOtpExpiry(); // 10 minutes from now
 * const expiry30 = generateOtpExpiry(30); // 30 minutes from now
 */
export const generateOtpExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Check if an OTP/code is still valid
 * @param {Date} expiryDate
 * @returns {boolean}
 */
export const isOtpValid = (expiryDate) => {
  return expiryDate && new Date() < new Date(expiryDate);
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. DATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add days to current date
 * @param {number} days
 * @returns {Date}
 */
export const addDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

/**
 * Add minutes to current date
 * @param {number} minutes
 * @returns {Date}
 */
export const addMinutes = (minutes) => new Date(Date.now() + minutes * 60 * 1000);

/**
 * Check if a date is in the past (expired)
 * @param {Date} date
 * @returns {boolean}
 */
export const isExpired = (date) => new Date() > new Date(date);

// ─────────────────────────────────────────────────────────────────────────────
// 14. PAGINATION HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse pagination params from query string
 * @param {object} query - req.query
 * @returns {{ page, limit, skip }}
 *
 * @example
 * const { page, limit, skip } = parsePagination(req.query);
 * const users = await User.find().skip(skip).limit(limit);
 * sendSuccess(res, { data: { users, page, limit, total } });
 */
export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build pagination metadata
 * @param {number} total - Total documents count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 *
 * @example
 * const total = await User.countDocuments(filter);
 * const meta = buildPaginationMeta(total, page, limit);
 */
export const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. STRING / MISC HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

/**
 * Remove sensitive fields from user object before sending
 * @param {object} user - Mongoose document or plain object
 * @param {string[]} [fields] - Extra fields to remove
 * @returns {object}
 *
 * @example
 * const safeUser = sanitizeUser(user);
 */
export const sanitizeUser = (user, fields = []) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  const defaultSensitive = ['password', 'otp', 'otpExpiry', 'refreshToken', '__v'];
  [...defaultSensitive, ...fields].forEach((field) => delete obj[field]);
  return obj;
};

/**
 * Pick specific keys from an object
 * مفيد لو عايز تاخد بس الـ fields المسموح بيها
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 *
 * @example
 * const body = pick(req.body, ['name', 'phone']); // ignore other fields
 */
export const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});

/**
 * Omit specific keys from an object
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((k) => delete result[k]);
  return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT — كل الـ utils في object واحد (اختياري)
// ─────────────────────────────────────────────────────────────────────────────

export default {
  // Async
  asyncHandler,

  // Errors
  AppError,
  globalErrorHandler,

  // Response
  sendSuccess,

  // Hash
  hashPassword,
  comparePassword,

  // JWT
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,

  // Crypto
  encryptText,
  decryptText,
  sha256Hash,

  // Email
  sendEmail,
  initCloudinary,
  otpEmailTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,

  // Cloudinary
  uploadToCloud,
  uploadPathToCloud,
  deleteFromCloud,

  // Regex
  REGEX,

  // Validation
  validate,
  schemas,

  // Auth
  authorize,
  isOwner,

  // OTP
  generateOtp,
  generateCode,
  generateOtpExpiry,
  isOtpValid,

  // Date
  addDays,
  addMinutes,
  isExpired,

  // Pagination
  parsePagination,
  buildPaginationMeta,

  // Misc
  capitalize,
  sanitizeUser,
  pick,
  omit,
};