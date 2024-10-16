const express = require("express");
const tableBookingController = require("../controllers/tableBooking-controller");
const router = express.Router();

//get all party bookings
router.get('/',tableBookingController.getTableBooking);

//get party by id 
router.get('/:id',tableBookingController.getTableBookingByID);

router.get('/customer/:id',tableBookingController.getTableBookingByCustomerID);

//add party
router.post('/',tableBookingController.addTableBooking);

//update party
router.patch('/:id',tableBookingController.updateTableBookingById);

//delete party
router.delete('/:id',tableBookingController.deleteTableBookingById);

router.use('/',tableBookingController.NotValidRoute);

module.exports = router;