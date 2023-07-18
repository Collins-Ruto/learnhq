"use client";
import { Result, ExamSeries, Exam } from "@prisma/client";
import React from "react";
import { streams } from "~/assets/names";
import {
  allStudents,
  examSeriesIds,
  periods,
  results,
  student_ids,
  students,
} from "~/assets/results";
import { Subjects } from "~/types/types";

function ExamGenerator() {
  const examSeries = [];
  streams.map((stream) => {
    const streamStudents = students.filter(
      (student) => student.streamId === stream.id
    );
    // const streamResults = results.filter((result) => result.streamId === stream.id)
  });

  // generateExamSeries();
  generateExams();

  return <div>Exam Generation</div>;
}

export default ExamGenerator;

function generateExams() {
  const exams: Exam[] = [];

  results.slice(2, 176).map((result, index) => {
    // console.log(result);

    const studentId = student_ids[index]?.id;
    const student = allStudents.find((student) => student.id === studentId);

    const examSeries = examSeriesIds.find(
      (serie) => serie.stream.id === student?.stream.id
    );

    const slug = `${examSeries?.year}-${examSeries?.form}-${examSeries?.term}`
      .replace(/\s/g, "-")
      .toLowerCase();
    const results: Result[] = [];
    Subjects.map((subject, index) => {
      if (result[index + 3] !== "") {
        const newResult = {
          slug: subject.slug,
          marks: result[index + 3]?.substring(0, 2),
        } as Result;
        results.push(newResult);
      }
    });

    const exam = {
      name: examSeries?.name,
      slug,
      term: examSeries?.term,
      createdAt: new Date(),
      examDate: new Date(),
      studentId: student?.id,
      examSeriesId: examSeries?.id,
      deleted: false,
      results,
    } as unknown as Exam;
    exams.push(exam);
  });
  console.log(exams);
}

function generateExamSeries() {
  const examSeries: ExamSeries[] = [];
  periods.map((period) => {
    const name = `${period.form} - ${period.year} - ${period.term}`;
    const examSerie = {
      ...period,
      name,
      createdAt: new Date(),
      seriesDate: new Date(),
      deleted: false,
      exams: [],
    } as unknown as ExamSeries;

    examSeries.push(examSerie);
  });
  console.log(examSeries);
}
