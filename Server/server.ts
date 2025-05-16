import express, { Request, Response } from "express";
import { connectDB } from "./Mongo";
import cors from "cors";
import MatchController from "./Controllers/MatchController";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/matches", async (req: Request, res: Response) => {
  MatchController.getMatches()
    .then((matches) => {
      res.status(200).json(matches);
    })
    .catch((error) => {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.get("/matches/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  MatchController.getMatchById(id)
    .then((match) => {
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.status(200).json(match);
    })
    .catch((error) => {
      console.error("Error fetching match by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.post("/matches", async (req: Request, res: Response) => {
  const { name, actions } = req.body;
  MatchController.createMatch(name, actions)
    .then((match) => {
      res.status(201).json(match);
    })
    .catch((error) => {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.put("/matches/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, actions } = req.body;
  MatchController.updateMatch(id, name, actions)
    .then((match) => {
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.status(200).json(match);
    })
    .catch((error) => {
      console.error("Error updating match:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.delete("/matches/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  MatchController.deleteMatch(id)
    .then((match) => {
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.status(200).json({ message: "Match deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting match:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
