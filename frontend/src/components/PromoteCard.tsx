"use client";

import { useWindowListener } from "@/hooks/useWindowListener";
import VideoPlayer from "./VideoPlayer";
import { useState } from "react";

export default function PromoteCard() {
  const [playing, setPlaying] = useState(true);

  useWindowListener("contextmenu", (e) => {
    e.preventDefault();
  });

  return (
    <div className="w-[80%] shadow-lg mx-[10%] my-10 p-6 rounded-xl bg-gray-200 flex flex-row">
      <VideoPlayer
        vdoSrc="/vdo/getvaccine.mp4"
        isPlaying={playing}
      ></VideoPlayer>
      <div className="my-2 mx-8 flex flex-col justify-between items-start">
        <p className="text-2xl font-medium">Get your vaccine today</p>
        <button
          className="block rounded-2xl bg-sky-600 hover:bg-indigo-600 px-7 py-2 text-white shadow-sm text-xl"
          onClick={() => {
            setPlaying(!playing);
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
