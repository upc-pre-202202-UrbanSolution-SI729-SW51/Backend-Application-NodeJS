const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("Social Media REST API NODE started")

connection();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const DriverRoutes = require("./routes/driverRoutes");
const OwnerRoutes = require("./routes/ownerRoutes");
const ParkingLotRoutes = require("./routes/parkingLotRoutes");
const CarRoutes = require("./routes/carRoutes");
const BookingRoutes = require("./routes/bookingRoutes");

app.use("/api/drivers", DriverRoutes);
app.use("/api/owners", OwnerRoutes);
app.use("/api/parkingLots", ParkingLotRoutes);
app.use("/api/cars", CarRoutes);
app.use("/api/bookings", BookingRoutes);

app.get("/test-route", (req, res) => {
    return res.status(200).json({
        "id": 1,
        "name": "Jose Lopez"
    });
});

app.listen(port, () => {
    console.log("Node server running in port:", port)
});