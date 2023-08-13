const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("Social Media REST API NODE started");

const uri = process.env.MONGO_URI || "mongodb+srv://joserodrigolopez:xK22YDi1adZJdw25@mongodbdeployed.nr8iyxd.mongodb.net/freeplace_back";

connection(uri);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DriverRoutes = require("./routes/driverRoutes");
const ParkingLotRoutes = require("./routes/parkingLotRoutes");
const CarRoutes = require("./routes/carRoutes");
const BookingRoutes = require("./routes/bookingRoutes");
const OwnerRoutes = require("./routes/ownerRoutes");
const FeedbackRoutes = require("./routes/feedbackRoutes");

app.use("/api/drivers", DriverRoutes);
app.use("/api/owners", OwnerRoutes);
app.use("/api/parkingLots", ParkingLotRoutes);
app.use("/api/cars", CarRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/feedbacks", FeedbackRoutes);

app.get("/test-route", (req, res) => {
    return res.status(200).json({
        "id": 1,
        "name": "Jose Lopez"
    });
});

app.listen(port, () => {
    console.log("Node server running in port:", port)
});