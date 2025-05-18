import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

export function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [embedUrl, setEmbedUrl] = useState<string>("");

  useEffect(() => {
    const getYouTubeEmbedUrl = (url: string): string => {
      const ytMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
      );
      if (!ytMatch) {
        return "https://www.youtube.com/embed/invalid";
      }
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    };

    setEmbedUrl(getYouTubeEmbedUrl(videoUrl));
  }, [videoUrl]);

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 400,
        height: 300,
      }}
      minHeight={180}
      minWidth={240}
      bounds="window"
      className="flex flex-col items-center justify-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        width: "300px",
        minWidth: 320,
        height: "auto",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        border: "1px solid #e5e7eb",
        padding: 24,
      }}
    >
      <iframe
        width="100%"
        height="80%"
        src={embedUrl ? embedUrl : "https://www.youtube.com/embed/invalid"}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoUrl || ""}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="border border-gray-300 rounded p-2"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </Rnd>
  );
}
