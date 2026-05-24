const MAX_ATTEMPTS = 6;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const loginAttempts = new Map();

function getAccountKey(body) {
    const key = (body.email || body.username || '').toLowerCase().trim();
    return key || null;
}

function checkLoginLock(req, res, next) {
    const key = getAccountKey(req.body);
    if (!key) return next();

    const record = loginAttempts.get(key);

    if (record && record.lockedUntil) {
        if (Date.now() < record.lockedUntil) {
            return res.status(423).json({
                message: "This account has been temporarily locked due to too many failed attempts. Please try again in 15 minutes."
            });
        }
        loginAttempts.delete(key);
    }

    next();
}

function recordFailedAttempt(body) {
    const key = getAccountKey(body);
    if (!key) return false;

    const record = loginAttempts.get(key) || { count: 0, lockedUntil: null };
    record.count += 1;

    if (record.count >= MAX_ATTEMPTS) {
        record.lockedUntil = Date.now() + LOCK_DURATION_MS;
        loginAttempts.set(key, record);
        return true; // account is now locked
    }

    loginAttempts.set(key, record);
    return false;
}

function resetAttempts(body) {
    const key = getAccountKey(body);
    if (key) loginAttempts.delete(key);
}

module.exports = { checkLoginLock, recordFailedAttempt, resetAttempts };
