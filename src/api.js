import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getContracts, getNetworkStats, getAllTransactions, getTransactionsByContract } from "./utils/planetscale.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: false,
  }),
);
app.use(bodyParser.json({ limit: "200mb" }));

app.use(function (req, res, next) {
  req.setTimeout(500000, function () {});
  next();
});

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ error: "An internal server error occurred." });
});

app.use(
  cors({
    origin: "*",
  }),
);

app.get("/stats", async (req, res) => {
  try {
    const data = await getNetworkStats();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/contracts", async (req, res) => {
  try {
    const data = await getContracts();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/contract/txs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getTransactionsByContract(id);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/txs/:limit/:type", async (req, res) => {
  try {
    const { limit, type } = req.params;
    const data = await getAllTransactions(Number(limit), type);

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});


app.listen(port, () => console.log("Server started"));
