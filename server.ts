import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for handling large base64 image strings (up to 12MB)
  app.use(express.text({ limit: '15mb' }));
  app.use(express.json({ limit: '15mb' }));

  // API end-points: Get current shared avatar
  app.get("/api/avatar", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const dbPath = path.join(process.cwd(), '.db_avatar.txt');
      try {
        const val = await fs.readFile(dbPath, 'utf8');
        return res.json({ avatar: val || null });
      } catch (e) {
        return res.json({ avatar: null });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read avatar database" });
    }
  });

  // Save new shared avatar
  app.post("/api/avatar", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const dbPath = path.join(process.cwd(), '.db_avatar.txt');
      const payload = req.body;
      
      if (!payload || payload === 'RESET') {
        try {
          await fs.unlink(dbPath);
        } catch (e) {}
        return res.json({ success: true, avatar: null });
      }
      
      await fs.writeFile(dbPath, payload, 'utf8');
      return res.json({ success: true, avatar: payload });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save avatar database" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
