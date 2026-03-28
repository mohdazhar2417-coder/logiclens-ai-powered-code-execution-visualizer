import bcrypt from "bcryptjs";
import { samplePrograms } from "./samplePrograms.js";

let idCounter = 1;

function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

const now = () => new Date().toISOString();

const demoUsers = [
  {
    _id: "user-admin-1",
    name: process.env.ADMIN_NAME || "LogicLens Admin",
    email: (process.env.ADMIN_EMAIL || "admin@logiclens.dev").toLowerCase(),
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "Admin123!", 10),
    role: "admin",
    createdAt: now(),
  },
  {
    _id: "user-student-1",
    name: "Demo Student",
    email: "student@logiclens.dev",
    passwordHash: bcrypt.hashSync("Student123!", 10),
    role: "student",
    createdAt: now(),
  },
];

const demoPrograms = samplePrograms.map((program, index) => ({
  ...program,
  _id: `program-${index + 1}`,
  createdAt: now(),
  updatedAt: now(),
}));

const demoTraces = [];
const demoFavorites = [];
const demoActivities = [];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export const demoStore = {
  users: {
    findByEmail(email) {
      return demoUsers.find((user) => user.email === email.toLowerCase()) || null;
    },
    findById(id) {
      return demoUsers.find((user) => user._id === id) || null;
    },
    create({ name, email, passwordHash, role = "student" }) {
      const user = {
        _id: nextId("user"),
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        createdAt: now(),
      };
      demoUsers.push(user);
      return clone(user);
    },
    updateName(id, name) {
      const user = demoUsers.find((entry) => entry._id === id);
      if (!user) return null;
      user.name = name;
      return clone(user);
    },
    count() {
      return demoUsers.length;
    },
  },
  activities: {
    add(action, userId, meta = {}) {
      demoActivities.push({
        _id: nextId("activity"),
        action,
        userId,
        meta,
        timestamp: now(),
      });
    },
  },
  programs: {
    list() {
      return clone(demoPrograms);
    },
    findById(id) {
      return clone(demoPrograms.find((program) => program._id === id) || null);
    },
    create(payload) {
      const program = {
        ...payload,
        _id: nextId("program"),
        tags: payload.tags || [],
        defaultInputs: payload.defaultInputs || {},
        createdAt: now(),
        updatedAt: now(),
      };
      demoPrograms.unshift(program);
      return clone(program);
    },
    update(id, payload) {
      const index = demoPrograms.findIndex((program) => program._id === id);
      if (index === -1) return null;
      demoPrograms[index] = {
        ...demoPrograms[index],
        ...payload,
        updatedAt: now(),
      };
      return clone(demoPrograms[index]);
    },
    delete(id) {
      const index = demoPrograms.findIndex((program) => program._id === id);
      if (index === -1) return null;
      const [removed] = demoPrograms.splice(index, 1);
      return clone(removed);
    },
    countFeatured() {
      return demoPrograms.filter((program) => program.featured).length;
    },
  },
  traces: {
    create(payload) {
      const trace = {
        ...payload,
        _id: nextId("trace"),
        savedAt: now(),
      };
      demoTraces.unshift(trace);
      return clone(trace);
    },
    listByUser(userId) {
      return clone(demoTraces.filter((trace) => trace.userId === userId));
    },
    findByUserAndId(userId, id) {
      return clone(demoTraces.find((trace) => trace.userId === userId && trace._id === id) || null);
    },
    deleteByUserAndId(userId, id) {
      const index = demoTraces.findIndex((trace) => trace.userId === userId && trace._id === id);
      if (index === -1) return null;
      const [removed] = demoTraces.splice(index, 1);
      return clone(removed);
    },
    count() {
      return demoTraces.length;
    },
  },
  favorites: {
    add(userId, program) {
      const existing = demoFavorites.find((favorite) => favorite.userId === userId && favorite.programId === program._id);
      if (existing) return clone(existing);

      const favorite = {
        _id: nextId("favorite"),
        userId,
        programId: program._id,
        programMeta: {
          name: program.name,
          category: program.category,
          subtype: program.subtype,
          difficulty: program.difficulty,
          tags: program.tags,
        },
        addedAt: now(),
      };
      demoFavorites.unshift(favorite);
      return clone(favorite);
    },
    listByUser(userId) {
      return clone(
        demoFavorites
          .filter((favorite) => favorite.userId === userId)
          .map((favorite) => ({
            ...favorite,
            programId: demoPrograms.find((program) => program._id === favorite.programId) || null,
          })),
      );
    },
    deleteByUserAndId(userId, id) {
      const index = demoFavorites.findIndex((favorite) => favorite.userId === userId && favorite._id === id);
      if (index === -1) return null;
      const [removed] = demoFavorites.splice(index, 1);
      return clone(removed);
    },
  },
};
