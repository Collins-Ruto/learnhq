"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Loader, PdfExams } from "~/components";
import Image from "next/image";
import { type Result, Subjects } from "~/types/types";
import { api } from "@/utils/api";
import type { Exam, ExamSeries, Stream, Student } from "@prisma/client";
import { useRouter } from "next/navigation";

function Exams() {
  const [submit, setSubmit] = useState(false);
  const [search, setSearch] = useState("");
  const [pagesCount, setPagesCount] = useState(0);
  const [pages, setPages] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
  });

    const router = useRouter();

  const [examSeries, setExamSeries] =
    useState<(ExamSeries & { stream: Stream })[]>();
  const { data, isLoading, error } = api.examSeries.getAll.useQuery();
  const { data: count } = api.examSeries.count.useQuery();

  useEffect(() => {
    if (data) {
      setExamSeries(data);
    }
    if (count && count > 20) {
      setPages((pages) => ({
        ...pages,
        hasNextPage: count - 20 > pagesCount,
      }));
      setPages((pages) => ({
        ...pages,
        hasPreviousPage: pagesCount + 20 > count,
      }));
    }
  }, [count, data, pagesCount]);

  if (error) {
    console.log(error);
  }

  const searchExams = api.examSeries.search.useQuery(search);

  const searchSubmit = () => {
    console.log("term sc exam", search);
    const { data } = searchExams;
    console.log("search data exam", data);
    setExamSeries(data);
    setSubmit(false);
  };

  return (
    <div className="w-screen md:w-full">
      <div className="p-4 pt-4 text-2xl font-semibold">
        <h3>Exam Results</h3>
      </div>
      {isLoading && <Loader />}
      <div className="flex flex-col justify-end gap-4 p-4 py-2 md:flex-row">
        <div>
          <input
            onChange={(e) => {
              setSearch(e.target.value);
              // searchSubmit();
            }}
            name="id"
            value={search}
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded border-[1px] bg-[#F7F6FB] px-3 py-2 leading-tight text-gray-800 shadow focus:outline-none"
            placeholder="Search student, Name, Term ..."
          />
        </div>
        <div className="flex justify-between gap-4">
          <div>
            {submit ? (
              <Button />
            ) : (
              <button
                onClick={() => {
                  searchSubmit();
                  // setSubmit(true);
                }}
                type="button"
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Search
              </button>
            )}
          </div>
          <div>
            <Link
              href="/page/addexam"
              type="button"
              className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              {" "}
              <Image
                width={100}
                height={100}
                src="https://img.icons8.com/ios-glyphs/30/FFFFFF/plus-math.png"
                className="mr-1 w-5 text-white"
                alt=""
              />
              Add
            </Link>
          </div>
          <div className="">
            {/* <PdfExams /> */}
          </div>
        </div>
      </div>
      <div className="m-4 overflow-auto rounded-xl bg-[#F7F6FB] p-4">
        <table className=" w-full text-justify">
          <thead>
            <tr className="p-4">
              <th className="p-2">Exam Series</th>
              <th className="p-2">Date</th>
              <th className="p-2">Form</th>
              <th className="p-2">Stream</th>
              <th className="p-2">Term</th>
              <th className="p-2">Year</th>
              <th className="p-2">Entries</th>
            </tr>
          </thead>
          <tbody>
            {examSeries?.map((examSerie, index) => {
              const date = new Date(examSerie.createdAt);
              return (
                  <tr
                      onClick={()=>{router.push(`/page/examseries/${examSerie.id}`)}}
                  className={`cursor-pointer p-4 text-sm ${index % 2 === 0 ? "bg-white" : ""}`}
                  key={index}
                >
                    <td className="p-2">{examSerie.name}</td>
                    <td className="p-2">{date.toDateString().slice(3, 15)}</td>
                    <td className="p-2">{examSerie?.form}</td>
                    <td className="p-2">{examSerie?.stream?.name}</td>
                    <td className="p-2">{examSerie?.term}</td>
                    <td className="p-2">{examSerie?.year}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center pb-10 pt-2 align-middle md:pb-0">
          <div
            onClick={() => {
              setPagesCount(pagesCount - 20);
            }}
            className={` ${
              pages.hasPreviousPage
                ? "cursor-pointer bg-slate-700 text-gray-100 hover:bg-gray-600 hover:text-white"
                : "bg-gray-300 text-gray-800"
            }  mr-3 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium `}
          >
            <svg
              aria-hidden="true"
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            Previous
          </div>
          <div
            onClick={() => {
              setPagesCount(pagesCount + 20);
            }}
            className={` ${
              pages.hasNextPage
                ? "cursor-pointer bg-slate-700 text-gray-100 hover:bg-gray-600 hover:text-white"
                : "bg-gray-300 text-gray-800"
            }  mr-3 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium `}
          >
            Next
            <svg
              aria-hidden="true"
              className="ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exams;
