import type { User } from "@prisma/client"

export type Search = {
  form: string,
  subject: Subject,
  search: string
}

export type Result = {
  slug: string
  marks: string
}

export const DummyUser: User = {
  id:"",
  slug: "",
  name: "",
  role: "",
  email: "",
  phone: "",
  streamId: "",
  emailVerified: ("") as unknown as Date,
  image: ""
}

export type Subject = {
  name: string
  slug: string
}

export type GradedSubjects = {
  name: string
  slug: string
  bar: number
}

export const Subjects: Subject[] = [
  {
    "name": "Chemistry",
    "slug": "chem"
  },
  {
    "name": "Biology",
    "slug": "bio"
  },
  {
    "name": "Maths",
    "slug": "math"
  },
  {
    "name": "English",
    "slug": "eng"
  },
  {
    "name": "Kiswahili",
    "slug": "kisw"
  },
  {
    "name": "Physics",
    "slug": "phy"
  },
  {
    "name": "Bussiness",
    "slug": "bss"
  },
  {
    "name": "Agriculture",
    "slug": "agri"
  },
  {
    "name": "History",
    "slug": "hist"
  },
  {
    "name": "Geography",
    "slug": "geo"
  },
  {
    "name": "CRE",
    "slug": "cre"
  },
  {
    "name": "Music",
    "slug": "msc"
  }
]

export const GradedSubjects: GradedSubjects[] = [
  {
    "name": "Chemistry",
    "slug": "chem",
    "bar": 85
  },
  {
    "name": "Biology",
    "slug": "bio",
    "bar": 85
  },
  {
    "name": "Maths",
    "slug": "math",
    "bar": 85
  },
  {
    "name": "English",
    "slug": "eng",
    "bar": 85
  },
  {
    "name": "Kiswahili",
    "slug": "kisw",
    "bar": 85
  },
  {
    "name": "Physics",
    "slug": "phy",
    "bar": 85
  },
  {
    "name": "Bussiness",
    "slug": "bss",
    "bar": 90
  },
  {
    "name": "Agriculture",
    "slug": "agri",
    "bar": 85
  },
  {
    "name": "History",
    "slug": "hist",
    "bar": 90
  },
  {
    "name": "Geography",
    "slug": "geo",
    "bar": 90
  },
  {
    "name": "CRE",
    "slug": "cre",
    "bar": 90
  },
  {
    "name": "Music",
    "slug": "msc",
    "bar": 90
  }
]

export type Grade ={
  score: string
  points: number
}

export const grades: Grade[] = [
  { score: "A", points: 85 },
  { score: "A-", points: 80 },
  { score: "B+", points: 75 },
  { score: "B", points: 70 },
  { score: "B-", points: 65 },
  { score: "C+", points: 60 },
  { score: "C", points: 55 },
  { score: "C-", points: 50 },
  { score: "D+", points: 45 },
  { score: "D", points: 40 },
  { score: "D-", points: 35 },
  { score: "E", points: 30 },
];
