import express from "express";

const app = express();
const PORT = process.env.PORT || 10533;

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
