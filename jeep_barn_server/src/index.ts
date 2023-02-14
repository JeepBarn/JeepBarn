import express from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const app = express();

var cors = require("cors");

app.use(cors());
app.use(express.json());

type ReserveDateBody = {
  jeepModel: string
  reservationDate: string,
}

app.put("/", async (req, res) => {
  const {jeepModel, reservationDate} = req.body as ReserveDateBody;
  const reservation = await client.reservation.create({
    data: {
      jeepModel,
      reservationDate,
    }
  });
  res.json({reservation});
});

app.listen(3000, () => {
  console.log("I got started!");
});