"use client";
// 引用套件
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  // 初始設置 搜尋框/搜索類型/語言/回傳結果/載入中/錯誤處理 的資料
  const [query, setQuery] = useState("");
  const [type, setType] = useState("repositories");
  const [language, setLanguage] = useState("javascript");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 使用 async await 等待請求完成再行下一步動作
  const searchBar = async () => {
    // Start loading status
    setLoading(true);
    setError(null);

    try {
      // url 涵括"類別"和"搜尋關鍵字"的變數
      // &per_page=100 可以決定回傳幾筆資料
      let url = `https://api.github.com/search/${type}?q=${encodeURIComponent(
        query
      )}&per_page=100`;
      if (type === "code") {
        // 使用變數帶入使用者搜索的語言
        url += `+in:file+language:${language}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer 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`,
        },
      });
      console.log(response.data.items);
      setResults(response.data.items); // 設置 data 至 results 中
    } catch (error) {
      setError("An error occurred while fetching repositories.");
    } finally {
      // Stop loading status
      setLoading(false);
    }
  };

  useEffect(() => {
    // 清除搜尋結果
    setResults([]);
  }, [query, type, language]); // 依賴更改時才重新執行

  return (
    <div className="searchBar">
      <div>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="repositories">Repositories</option>
          <option value="code">Code</option>
        </select>
        {type === "code" && (
          <select
            className="code"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="ball">Ball</option>
            <option value="shell">Shell</option>
            <option value="c#">C#</option>
            <option value="c++">C++</option>
            <option value="php">PHP</option>
          </select>
        )}
      </div>
      <input
        className="type"
        type="text"
        value={query}
        // 輸入框每次異動 便將使用者輸入值存進 query 以利後續搜尋操作
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn" onClick={searchBar}>
        Search
      </button>

      {/* Loading or not */}
      {loading && <p>Loading...</p>}
      {/* Error or not */}
      {error && <p>{error}</p>}

      <ul className="list">
        {results.map((result, index) => (
          <li key={result.name + index}>
            {/* 用三元運算子根據搜索類型顯示不同的結果 */}
            {type === "repositories" ? (
              <>
                <strong>{result.full_name}</strong>:{result.description}
                <a
                  href={result.clone_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Clone
                </a>
              </>
            ) : (
              <>
                <strong>{result.name}</strong>:{" "}
                {result.repository
                  ? result.repository.description
                  : "Description not available"}
                <a
                  href={result.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
