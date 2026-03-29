import React, { useState } from "react";

const Verify = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!input) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const getYoutubeEmbed = (url) => {
    if (!url) return "";

    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("youtube.com")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    return "";
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Verify Content</h1>

      <textarea
        className="w-full border p-3 rounded"
        rows="4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste link or claim..."
      />

      <button
        onClick={handleVerify}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Verify Content"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="font-bold text-lg">AI Result</h3>

          <p className="mt-2 whitespace-pre-line">
            {result.reply}
          </p>

          {getYoutubeEmbed(input) && (
            <iframe
              className="mt-4 w-full rounded"
              height="300"
              src={getYoutubeEmbed(input)}
              title="YouTube video"
              allowFullScreen
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Verify;