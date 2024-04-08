import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// requireAuth middleware will validate the access token sent by the client and will return the user information within req.auth
app.get("/notes", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (user) {
      // 如果用户已登录,获取该用户创建的所有笔记
      const notes = await prisma.note.findMany({
        where: {
          authorId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(notes);
    } else {
      // 如果用户未在数据库中找到,返回错误响应
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/public/notes", async (req, res) => {
  try {
    // 获取所有公开的笔记
    const notes = await prisma.note.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching public notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// creates a note
app.post("/notes", requireAuth, async (req, res) => {
  const { title, content ,isPublic} = req.body;
  const authorId = req.auth.payload.sub;

  if (!title || !content) {
    res.status(400).send("Title and content are required");
  } else {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        isPublic,
        author: { connect: { auth0Id: authorId } },
      },
    });

    res.status(201).json(newNote);
  }
});

// deletes a note by id
app.delete("/notes/:id", requireAuth, async (req, res) => {
  const noteId = parseInt(req.params.id);
  const authorId = req.auth.payload.sub;

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      author: { auth0Id: authorId },
    },
  });

  if (!note) {
    res.status(404).send("Note not found");
  } else {
    await prisma.note.delete({
      where: { id: noteId },
    });

    res.sendStatus(204);
  }
});


// get a note by id
app.get("/notes/:id", requireAuth, async (req, res) => {
  const noteId = parseInt(req.params.id);
  const authorId = req.auth.payload.sub;

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      author: { auth0Id: authorId },
    },
  });

  if (!note) {
    res.status(404).send("Note not found");
  } else {
    res.json(note);
  }
});


// get a public note by id
app.get("/public/notes/:id", async (req, res) => {
  const noteId = parseInt(req.params.id);

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      isPublic: true,
    },
  });

  if (!note) {
    res.status(404).send("Note not found");
  } else {
    res.json(note);
  }
});

// updates a note by id
app.put("/notes/:id", requireAuth, async (req, res) => {
  const noteId = parseInt(req.params.id);
  const authorId = req.auth.payload.sub;
  const { title, content } = req.body;

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      author: { auth0Id: authorId },
    },
  });

  if (!note) {
    res.status(404).send("Note not found");
  } else {
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { title, content },
    });

    res.json(updatedNote);
  }
});


// 检查笔记是否被收藏
app.get("/favorites", requireAuth, async (req, res) => {
  const { noteId } = req.query;
  const userId = req.auth.payload.sub;

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        noteId: parseInt(noteId),
        user: { auth0Id: userId },
      },
    });

    res.json(favorites);
  } catch (error) {
    console.error("Failed to fetch favorites", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// 获取用户收藏的所有笔记
app.get("/favoritedNotes", requireAuth, async (req, res) => {
  const userId = req.auth.payload.sub;

  try {
    const favoritedNotes = await prisma.favorite.findMany({
      where: {
        user: { auth0Id: userId },
      },
      select: {
        note: true,
      },
    });

    res.json(favoritedNotes.map((favorite) => favorite.note));
  } catch (error) {
    console.error("Failed to fetch favorited notes", error);
    res.status(500).json({ error: "Failed to fetch favorited notes" });
  }
});

app.post("/favorites", requireAuth, async (req, res) => {
  const { noteId } = req.body;
  const userId = req.auth.payload.sub;

  try {
    const favorite = await prisma.favorite.create({
      data: {
        note: { connect: { id: parseInt(noteId) } },
        user: { connect: { auth0Id: userId } },
      },
    });

    res.json(favorite);
  } catch (error) {
    console.error("Failed to add favorite", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});


// 删除收藏
app.delete("/favorites", requireAuth, async (req, res) => {
  const { noteId } = req.query;
  const userId = req.auth.payload.sub;

  try {
    await prisma.favorite.deleteMany({
      where: {
        noteId: parseInt(noteId),
        user: { auth0Id: userId },
      },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Failed to remove favorite", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
    include: {
      notes: true,
    },
  });

  if (!user) {
    res.status(404).send("User not found");
  } else {
    res.json({
      ...user,
      notesCount: user.notes.length,
    });
  }
});

app.put("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { name, bio } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        auth0Id,
      },
      data: {
        name,
        bio,
      },
      include: {
        notes: true,
      },
    });

    res.json({
      ...updatedUser,
      notesCount: updatedUser.notes.length,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});