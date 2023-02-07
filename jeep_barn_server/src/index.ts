import express from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const app = express();

var cors = require("cors");

app.use(cors());
app.use(express.json());

type ReserveDateBody = {
  date: Date,
  jeep: any
}

app.put("/", (req, res) => {
  const {date, jeep} = req.body as ReserveDateBody;
  res.json({
    date,
    jeep,
  });
});

app.listen(3000, () => {
  console.log("I got started!");
});