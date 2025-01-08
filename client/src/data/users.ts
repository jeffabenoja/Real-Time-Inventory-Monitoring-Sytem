import { AdminUser, RegularUser } from "../type/user";

const users: (AdminUser | RegularUser)[] = [
  {
    name: "Alice",
    role: "admin",
    email: "alice@example.com",
  },
  {
    name: "Bob",
    role: "admin",
    email: "bob@example.com",
  },
  {
    name: "Charlie",
    role: "admin",
    email: "charlie@example.com",
  },
  {
    name: "David",
    role: "user",
    access: {
      reports: { read: true, write: true },
      sales: { read: true, write: true },
      stocklist: { read: false, write: false },
      inventory: { read: true, write: false },
      users: { read: false, write: false },
    },
    email: "david@example.com",
  },
  {
    name: "Eve",
    role: "user",
    access: {
      reports: { read: true, write: false },
      sales: { read: false, write: false },
      stocklist: { read: true, write: false },
      inventory: { read: false, write: false },
      users: { read: false, write: false },
    },
    email: "eve@example.com",
  },
  {
    name: "Frank",
    role: "user",
    access: {
      reports: { read: true, write: false },
      sales: { read: true, write: false },
      stocklist: { read: true, write: false },
      inventory: { read: false, write: false },
      users: { read: false, write: false },
    },
    email: "frank@example.com",
  },
  {
    name: "Grace",
    role: "user",
    access: {
      reports: { read: true, write: true },
      sales: { read: true, write: false },
      stocklist: { read: false, write: false },
      inventory: { read: true, write: false },
      users: { read: false, write: false },
    },
    email: "grace@example.com",
  },
  {
    name: "Hank",
    role: "user",
    access: {
      reports: { read: true, write: true },
      sales: { read: true, write: false },
      stocklist: { read: false, write: false },
      inventory: { read: true, write: true },
      users: { read: false, write: false },
    },
    email: "hank@example.com",
  },
  {
    name: "Ivy",
    role: "user",
    access: {
      reports: { read: false, write: false },
      sales: { read: false, write: false },
      stocklist: { read: false, write: false },
      inventory: { read: false, write: false },
      users: { read: false, write: false },
    },
    email: "ivy@example.com",
  },
  {
    name: "Jack",
    role: "user",
    access: {
      reports: { read: true, write: true },
      sales: { read: true, write: true },
      stocklist: { read: true, write: false },
      inventory: { read: false, write: false },
      users: { read: false, write: false },
    },
    email: "jack@example.com",
  },
  {
    name: "Katie",
    role: "user",
    access: {
      reports: { read: true, write: false },
      sales: { read: true, write: false },
      stocklist: { read: true, write: false },
      inventory: { read: false, write: false },
      users: { read: false, write: false },
    },
    email: "katie@example.com",
  },
  {
    name: "Liam",
    role: "user",
    access: {
      reports: { read: true, write: true },
      sales: { read: false, write: false },
      stocklist: { read: false, write: false },
      inventory: { read: true, write: true },
      users: { read: false, write: false },
    },
    email: "liam@example.com",
  },
  {
    name: "Mia",
    role: "user",
    access: {
      reports: { read: false, write: false },
      sales: { read: false, write: false },
      stocklist: { read: false, write: false },
      inventory: { read: true, write: false },
      users: { read: false, write: false },
    },
    email: "mia@example.com",
  },
  {
    name: "Noah",
    role: "user",
    access: {
      reports: { read: true, write: true },
      sales: { read: true, write: true },
      stocklist: { read: false, write: false },
      inventory: { read: false, write: false },
      users: { read: false, write: false },
    },
    email: "noah@example.com",
  },
  {
    name: "Olivia",
    role: "user",
    access: {
      reports: { read: true, write: false },
      sales: { read: false, write: false },
      stocklist: { read: true, write: false },
      inventory: { read: false, write: false },
      users: { read: false, write: false },
    },
    email: "olivia@example.com",
  },
  {
    name: "Peter",
    role: "user",
    access: {
      reports: { read: true, write: false },
      sales: { read: false, write: false },
      stocklist: { read: false, write: false },
      inventory: { read: true, write: false },
      users: { read: false, write: false },
    },
    email: "peter@example.com",
  },
];

export default users;
