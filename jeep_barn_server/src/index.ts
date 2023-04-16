import express from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const app = express();
import { authenticationMiddleware, JWTBody, RequestWithJWTBody } from "./authentication";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

var cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(authenticationMiddleware);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                         *
 *                   Jeep Reservations                     *
 *                                                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.post("/jeeps/reserve", async (req : RequestWithJWTBody, res) => {
  const userId = req.jwtBody?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const jeepModel = req.body.jeepModel;
  const jeepCost = Number(jeepModel.substring(4));
  const user = await client.user.findUnique({
    where: {
      id: userId
    },
  });
  if (jeepCost > user!!.balance) {
    res.status(401).json({ message: "Insufficient Funds" });
    return;
  }
  // ISO String
  const reservationDate = req.body.reservationDate;
  const lojacked = false;
  const reservations = await client.reservation.findMany({
    where: {
      jeepModel,
      reservationDate : {
        gte: reservationDate,
        lte: reservationDate,
      }
    }
  });
  if (Object.keys(reservations).length > 0) {
    res.status(401).json({ message: "Date Already Reserved" });
    return;
  }
  const reservation = await client.reservation.create({
    data: {
      user : {connect : { id : userId }},
      jeepModel,
      reservationDate,
      lojacked
    }
  });
  const updatedUser = await client.user.update({
    where: {
      id: userId
    },
    data: {
      balance: {
        decrement: jeepCost
      }
    }
  });
  res.json({reservation, "user" : { "balance" : updatedUser.balance }});
});

function daysInMonth(year : number, monthIndex : number) {
  return (new Date(year, monthIndex+1, 0)).getDate();
}

app.get("/jeeps/:jeepModel/:year/:monthIndex", async (req : RequestWithJWTBody, res) => {
  const jeepModel = req.params.jeepModel;
  const monthIndex = Number(req.params.monthIndex);
  const year = Number(req.params.year);
  const totalDays = daysInMonth(year, monthIndex);
  const reservations = await client.reservation.findMany({
    where: {
      jeepModel,
      reservationDate : {
        gte: (new Date(year, monthIndex+1, 1)).toISOString(),
        lte: (new Date(year, monthIndex+1, totalDays)).toISOString(),
      }
    }
  });
  res.json(reservations.map(reservation => (new Date(reservation.reservationDate)).getDate()));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                         *
 *                     User Creation                       *
 *                                                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const passwordHash = await bcrypt.hash(password, 10);
  const userType = req.body.usertype;

  const user = await client.user.create({
    data: {
      username,
      passwordHash,
      balance: 1000,
    },
  });
  
  let manager = false;
  if (userType == "manager") {
    manager = true;
  }

  const permissions = await client.permissions.create({
    data: {
      user : {connect : { id : user.id }},
      clerk : userType == "clerk",
      manager : userType == "manager",
    },
  });

  const token = jwt.sign({userId: user.id, balance: user.balance}, process.env.ENCRYPTION_KEY!!);
  res.json({"user" : { "id" : user?.id, "username" : user?.username, "balance" : user?.balance, permissions}, token});
});

app.post("/login", async (req : RequestWithJWTBody, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await client.user.findFirst({
    where: {
      username,
    }
  });
  if (!user) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const permissions = await client.permissions.findFirst({
    where: {
      userId : user.id,
    }
  });

  const token = jwt.sign({ userId: user.id, balance: user.balance }, process.env.ENCRYPTION_KEY!!);
  res.json({"user" : { "id" : user?.id, "username" : user?.username, "balance" : user?.balance, permissions}, token});
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                         *
 *                      Management                         *
 *                                                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.get("/clerks", async (req : RequestWithJWTBody, res) => {

  const clerkPermissions = await client.permissions.findMany({
    where: {
      clerk : true,
    }
  });

  let clerkUserIds : number[] = [];
  clerkPermissions.forEach((clerkPermission) => {clerkUserIds.push(clerkPermission.userId);});

  const clerks = await client.user.findMany({
    where: {
      id : { in: clerkUserIds },
    }
  });

  res.json(clerks);
});

app.listen(3000, () => {
  console.log("I got started!");
});