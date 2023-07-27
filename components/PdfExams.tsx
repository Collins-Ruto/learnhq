"use client";

// import { api } from "@/utils/api";
import type { Exam, Stream, Student } from "@prisma/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
// import {  useState } from "react";
import { Subjects, grades } from "~/types/types";

export default function AppComponent({
  exams,
}: {
  exams: (Exam & { student: Student & { stream: Stream } })[];
}) {
  // initalize JSPDF doc print landscape page
  const doc = new jsPDF("landscape");

  // const [printExams, setExams] =
  //   useState<(Exam & { student: Student & { stream: Stream } })[]>(exams);

  const printExams: (Exam & { student: Student & { stream: Stream } })[] =
    exams;
  // const { data, isLoading } = api.exam.getAllPrint.useQuery();

  // useEffect(() => {
  //   if (data) {
  //     setExams(data);
  //   }
  // }, [data]);

  const filterstd = () => {
    const results: [string[]] = [[]];
    if (!printExams) {
      return [];
    }
    printExams?.map((std) => {
      const newStd = [
        std.student.admissionId,
        std.student.name,
        std.student.stream.slug?.toUpperCase(),
      ];
      let avg = 0;
      let subjectCount = 0;
      Subjects.map((sbj) => {
        const result = std.results.filter((res) => res.slug === sbj.slug);

        const marked = markGrade(result[0]?.marks ?? "-");
        newStd.push(marked);
        avg += parseInt(result[0]?.marks ?? "0");
        subjectCount += result[0]?.marks ? 1 : 0;
      });

      newStd.push(subjectCount.toString());
      newStd.push(std.student.kcpe.toString());
      newStd.push(avg.toString());
      newStd.push((avg / subjectCount).toFixed(2).toString());
      newStd.push((avg / subjectCount / subjectCount).toFixed(2).toString());

      results.push(newStd);
    });
    return results;
  };

  const markGrade = (mark: string) => {
    let marked = "-";
    if (mark === "-") {
      return "-";
    }
    // some() is used so that we can exit the loop once the mark is greater than grade
    grades.some((grade) => {
      const score = grade.score;
      const points = grade.points;
      if (parseInt(mark) >= points) {
        marked = `${mark} ${score}`;
        return true;
      }
    });

    return marked;
  };

  const grading = () => {
    const results = filterstd();

    results.map((obj) => {
      grades.map((grade) => {
        const mark = parseInt(obj[obj.length - 2] || "0");
        const score = grade.score;
        const points = grade.points;
        if (mark >= points) {
          obj.push(score);
        }
      });
      if (obj.length < 22) {
        obj.push("X");
      }
    });

    return results;
  };

  const streamRank = () => {
    interface StreamRes {
      stream: string;
      results: [string[]];
    }
    const results = grading();
    const resultsByStream: { [key: string]: StreamRes } = {};

    if (!results) return

    for (const result of results) {
      if (!resultsByStream[result[2] ?? ""]) {
        console.log("hold not")
        resultsByStream[result[2] ?? ""] = { stream: result[2] ?? "", results: [] } as unknown as StreamRes;
      }
      resultsByStream[result?.[2] ?? ""]?.results?.push(result);
    }

    // Rank students within each stream based on overallRank
    for (const stream in resultsByStream) {
      const studentsInStream = resultsByStream[stream];
      if (!studentsInStream) return
      studentsInStream.results.sort(
        (a, b) =>
          parseInt(b[b.length - 3] || "0") - parseInt(a[a.length - 3] || "0")
      );
      for (let i = 0; i < studentsInStream.results.length; i++) {
        studentsInStream.results[i]?.push((i + 1).toString());
      }
    }

    // Flatten the ranked students from different streams back to a single array
    const rankedStudents: string[][] = [];
    for (const result in resultsByStream) {
      const res = resultsByStream[result];
      res?.results.map((ress) => (rankedStudents.push(ress)));
    }
    //  console.log(rankedStudents);
    return rankedStudents;
  }

  // streamRank();

  const overallRank = () => {
    const results = streamRank();
    if (!results) return

    results.sort(
      (a, b) =>
        parseInt(b[b.length - 4] || "0") - parseInt(a[a.length - 4] || "0")
    );

    const finalResults: [string[]] = [[]];

    results.map((obj, index) => {

      obj.push((index + 1).toString());
      finalResults.push(obj);
    });
    // remove empty fields created by array.push()
    return finalResults.filter((obj) => obj[3]);
  };

  console.log(overallRank());

  // autoTable(doc, {
  //   theme: "plain",
  //   styles: {
  //     fillColor: "#3366ff",
  //   },
  // });

  // AutoTable formating
  autoTable(doc, {
    body: [
      [
        {
          content: "Ace Academy",
          styles: {
            halign: "center",
            fontSize: 16,
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content: exams[0]?.name,
          styles: {
            halign: "center",
            fontSize: 12,
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    head: [
      [
        "ADM",
        "NAME",
        "STR",
        "ENG",
        "KIS",
        "MAT",
        "BIO",
        "PHY",
        "CHE",
        "HIS",
        "GEO",
        "CRE",
        "AGR",
        "COM",
        "FRE",
        "BST",
        "SBJ",
        "KCPE",
        "AVG",
        "PTS",
        "MN PTS",
        "GRD",
        "STR POS",
        "OVR POS",
      ],
    ],
    body: overallRank(),
    theme: "grid",
    headStyles: {
      fillColor: "#343a40",
    },
    styles: {
      fontSize: 7,
      minCellWidth: 9,
    },
  });

  const download = () => {
    doc.save("exam");
  };

  return (
    <div>
      {/* {isLoading  ? (
        <div className="items-center rounded bg-gray-600 px-4 py-2 font-bold text-white">
          preparing
        </div>
      ) : ( */}
      <button
        onClick={() => {
          download();
        }}
        type="button"
        className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Download
        <Image
          src="https://img.icons8.com/sf-regular-filled/48/FFFFFF/downloading-updates.png"
          className="ml-1 w-6 "
          height={100}
          width={100}
          alt=""
        />
      </button>
      {/*  )} */}
    </div>
  );
}
