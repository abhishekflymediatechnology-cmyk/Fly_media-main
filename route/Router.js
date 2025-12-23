let express = require('express');
const { handleappsignup, handleappotp, handleapplogin, handleForgotPassword, verifyForgotOtp, resetPassword } = require('../controller/Controller');

let router = express.Router();
router.post('/app/signup',handleappsignup);
router.post('/app/otp',handleappotp);
router.post('/app/login',handleapplogin);
router.post('/app/forgot-password',handleForgotPassword);
router.post('/app/verify-forgot-otp',verifyForgotOtp);
router.post('/app/reset-password',resetPassword);

module.exports = router;