var router = require('express').Router();
var controller = require('../controllers/userControllers');
var bookController = require('../controllers/bookController');
//var staticControllers=require('../controllers/staticControllers')
//var authController=require('../controllers/auth');
router.post('/signUp', controller.signUp);
router.post('/login', controller.login);
router.post('/otpVerify', controller.otpVerify);
router.post('/resendOtp', controller.resendOtp);
router.post('/forgotPassword', controller.forgotPassword);
//For books Apis.
router.post('/addBook', bookController.addBook);
router.get('/allBooks', bookController.allBooks);
router.post('/editBook', bookController.editBook);
router.post('/deleteBook', bookController.deleteBook);
router.post('/uploadImage', bookController.uploadImage);
router.post('/uploadingViaMulter', bookController.uploadingViaMulter);
router.post('/checkLike', bookController.checkLike);
router.post('/countLike', bookController.countLike);
router.post('/manageUser', bookController.manageUser);
router.post('/showAllBook', bookController.showAllBook);
router.post('/checkDetails', bookController.checkDetails);
router.get('/downloadDataInXl', bookController.downloadDataInXl);
// router.get('/downloadFile', bookController.downloadFile);


module.exports = router;