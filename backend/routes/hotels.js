const express = require("express");
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  addRating,
  getHotelsByPriceRange,
  getRandomHotel,
} = require("../controllers/hotels");

//Include other resource routes
const bookingRouter = require("./bookings");

const router = express.Router();

const { semiprotect, protect, authorize } = require("../middleware/auth");

/**
* @swagger  
* components:
*   schemas:
*     Hotel:
*       type: object
*       required:
*         - name
*         - address
*         - district
*         - province
*         - postalcode
*         - tel
*         - region
*         - image
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: The auto-generated id of the hotel
*           example: 660255d64df8343ed9dafe35
*         name:
*           type: string
*           description: Hotel name
*           example: Example Hotel
*         address:
*           type: string
*           description: Hotel No., Street, Road
*           example: 123 Example St
*         district:
*           type: string
*           description: District
*           example: Example District
*         province:
*           type: string
*           description: Province
*           example: Example Province
*         postalcode:
*           type: string
*           description: 5-digit postal code
*           example: 12345
*         tel:
*           type: string
*           description: Telephone number
*           example: 123-456-7890
*         region:
*           type: string
*           description: Region
*           example: Example Region
*         image:
*           type: string
*           description: URL of the hotel image
*           example: https://example.com/hotel.jpg
*         rating:
*           type: number
*           description: Average rating of the hotel
*           example: 4.5
*         ratingCount:
*           type: integer
*           description: Number of ratings the hotel has received
*           example: 100
*         amenities:
*           type: array
*           description: List of amenities offered by the hotel
*           items:
*             type: string
*             example: WiFi
*         roomType:
*           type: array
*           description: List of room types offered by the hotel
*           items:
*             type: object
*             properties:
*               key:
*                 type: string
*                 description: Room type keyword
*                 example: standard
*               price:
*                 type: number
*                 description: Price of the room type
*                 example: 100.0
*         minPrice:
*           type: number
*           description: Minimum price among all room types
*           example: 80.0
*         maxPrice:
*           type: number
*           description: Maximum price among all room types
*           example: 200.0
*       example:
*         name: Example Hotel
*         address: 123 Example St
*         district: Example District
*         province: Example Province
*         postalcode: 12345
*         tel: 123-456-7890
*         region: Example Region
*         image: https://example.com/hotel.jpg
*         rating: 4.5
*         ratingCount: 100
*         amenities:
*           - WiFi
*           - Pool
*         roomType:
*           - key: standard
*             price: 100.0
*           - key: deluxe
*             price: 150.0
*         minPrice: 80.0
*         maxPrice: 200.0
*/
/**
* @swagger
* tags:
*   name: Hotels
*   description: The hotels managing API
*/
/**
* @swagger
* /hotels:
*   get:
*     summary: Returns the list of all hotels
*     tags: [Hotels]
*     responses:
*       200:
*         description: The list of hotels
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Hotel'
*/
/**
* @swagger
* /hotels/{id}:
*   get:
*     summary: Get the hotel by id
*     tags: [Hotels]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The hotel id
*         example: 65df5083dc8452a715f007cd
*     responses:
*       200:
*         description: The hotel description by id
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Hotel'
*       404:
*         description: The hotel was not found
*/
/**
* @swagger
* /hotels:
*   post:
*     summary: Create a new hotel
*     tags: [Hotels]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Hotel'
*     responses:
*       201:
*         description: The hotel was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Hotel'
*       500:
*         description: Some server error
*/
/**
* @swagger
* /hotels/{id}:
*   put:
*     summary: Update the hotel by the id
*     tags: [Hotels]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The hotel id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Hotel'
*     responses:
*       200:
*         description: The hotel was updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Hotel'
*       404:
*         description: The hotel was not found
*       500:
*         description: Some error happened
*/
/**
* @swagger
* /hotels/{id}:
*   delete:
*     summary: Remove the hotel by id
*     tags: [Hotels]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The hotel id
*     responses:
*       200:
*         description: The hotel was deleted
*       404:
*         description: The hotel was not found
*/
/**
* @swagger
* /hotels/random:
*   get:
*     summary: Returns the list of random hotels
*     tags: [Hotels]
*     parameters:
*       - in: query
*         name: count
*         schema:
*           type: string
*         required: true
*         description: The amount of random hotels
*         example: 2
*     responses:
*       200:
*         description: The list of random hotels
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Hotel'
*/

//Re-route into other resource routers
router.use("/:hotelId/bookings/", bookingRouter);

router.route("/price").get(semiprotect, getHotelsByPriceRange);
router.route("/random").get(getRandomHotel);

router
  .route("/")
  .get(semiprotect, getHotels)
  .post(protect, authorize("admin"), createHotel);
router
  .route("/:id")
  .get(semiprotect, getHotel)
  .put(protect, authorize("admin"), updateHotel)
  .delete(protect, authorize("admin"), deleteHotel);
router.route("/rating/:id").put(protect, addRating);

// Route for getting hotels by price range

module.exports = router;
