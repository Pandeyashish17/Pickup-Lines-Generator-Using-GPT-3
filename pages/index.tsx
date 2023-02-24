import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Head from "next/head";
interface ApiResponse {
  line: string;
}

export default function PickupLineGenerator() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pickupLines, setPickupLines] = useState<string[]>([]);
  const [count, setCount] = useState(3);
  const [apiKey, setApiKey] = useState("");
  const [pageTitle, setPageTitle] = useState(
    "PickUp Lines Generator using GPT-3"
  );

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setPageTitle("Hey Daddy! Please Come Back");
    } else {
      setPageTitle("PickUp Lines Generator using GPT-3");
    }
  };

  const generatePickupLines = async (count: number) => {

    if(count > 10){
      return toast.error("cannot do more than ten")
      }
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse[]>(`/api/generate`, {
        params: {
          keyword: keyword,
          count: count,
          apikey: apiKey,
        },
      });
      toast.success(`Successfully generated ${count} Pickup Lines`);
      const lines = response.data.map((item) => item.line);
      setPickupLines(lines);
      setLoading(false);
    } catch (error) {
      toast.error(`${error}`);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(` Pickup line copied to clipboard!`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded-md">
      <Head>
        <meta name="title" content="PickUp Lines Generator using GPT-3" />
        <meta
          name="description"
          content="Unleash your charm with our Pickup Lines Generator powered by GPT-3! Find clever, flirty, and romantic lines in just a few clicks. Try it now!"
        />
        <meta
          name="keywords"
          content="pickup lines, generator, GPT-3, first impression, icebreaker, flirting, romance, AI-powered, conversation starter, charm"
        />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Ashish Pandey" />
        <title>{pageTitle}</title>
      </Head>
      <div className="mb-5 flex gap-2 flex-col">
        <center className="font-bold text-3xl ">Pickup Line Generator</center>
        <p>
          For API Key Go to this link{" "}
          <a
            className="text-blue-600"
            href="https://platform.openai.com/account/api-keys"
          >
            https://platform.openai.com/account/api-keys
          </a>
          . generate secret key and just paste it here. and dont worry i am not
          saving your api key
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="API KEY" className="font-medium mb-2 block">
          API KEY:
        </label>
        <input
          type="text"
          placeholder="Enter your API KEY here..."
          className="border border-gray-300 rounded-md p-2 w-full"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="keyword" className="font-medium mb-2 block">
          Keyword:
        </label>
        <input
          type="text"
          placeholder="Enter a keyword..."
          className="border border-gray-300 rounded-md p-2 w-full"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="count" className="font-medium mb-2 block">
          Number of Pickup Lines (1-10):
        </label>
        <input
          type="number"
          name="count"
          id="count"
          min={1}
          max={10}
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>
      <button
        className={`bg-blue-500 text-white rounded-md py-2 px-4 ${
          loading || !keyword || !apiKey ? "opacity-50 cursor-not-allowed" : ""
        } $`}
        disabled={!keyword || loading || !apiKey}
        onClick={() => generatePickupLines(count)}
      >
        {loading ? "Generating..." : "Generate Pickup Lines"}
      </button>
      {pickupLines.length > 0 && (
        <div className="mt-4">
          <label htmlFor="pickup-lines" className="font-medium mb-2 block">
            Generated Pickup Lines:
          </label>
          <ul id="pickup-lines" className="bg-gray-100 p-2 rounded-md">
            {pickupLines.map((line) => (
              <li key={line} className="mb-2 flex justify-between">
                {line}
                <button
                  className="ml-2 bg-blue-500 text-white rounded-md py-1 px-2"
                  onClick={() => copyToClipboard(line)}
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
