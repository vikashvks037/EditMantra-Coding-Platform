import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const defaultCode = {
  htmlmixed: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>`,
  css: `body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}`,
  javascript: `console.log('Hello, World!');`,
};

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("htmlmixed");
  const [code, setCode] = useState(defaultCode["htmlmixed"]);
  const [consoleOutput, setConsoleOutput] = useState([]); // To store console logs

  // Initialize the editor
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: language,
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      // Set the default code when the editor initializes
      editorRef.current.setValue(code);

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const newCode = instance.getValue();
        setCode(newCode);
        onCodeChange(newCode);
        if (origin !== "setValue") {
          socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: newCode,
          });
        }
      });
    }
    init();

    // Cleanup editor on component unmount
    return () => {
      editorRef.current?.toTextArea();
      editorRef.current = null;
    };
  }, [language, onCodeChange, roomId, socketRef]);

  // Handle incoming code changes
  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      const handleCodeChange = ({ code }) => {
        if (code !== null && editorRef.current) {
          editorRef.current.setValue(code);
        }
      };

      socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      return () => {
        socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef]);

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    const newCode = defaultCode[newLanguage];
    setCode(newCode);
    if (editorRef.current) {
      editorRef.current.setOption("mode", newLanguage);
      editorRef.current.setValue(newCode);
    }
  };

  // Clear editor content
  const handleClearScreen = () => {
    const clearText = "";
    setCode(clearText);
    if (editorRef.current) {
      editorRef.current.setValue(clearText);
    }
  };

  // Display the merged result
  const handleViewResult = () => {
    const iframe = document.getElementById("outputFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    // Fetch the code for all languages
    const htmlCode =
      language === "htmlmixed" ? editorRef.current.getValue() : defaultCode.htmlmixed;
    const cssCode =
      language === "css" ? editorRef.current.getValue() : defaultCode.css;
    const jsCode =
      language === "javascript" ? editorRef.current.getValue() : defaultCode.javascript;

    // Merge HTML, CSS, and JavaScript
    const fullCode = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            try {
              ${jsCode}
            } catch (error) {
              console.error("Error in JavaScript:", error);
            }
          });
        </script>
      </body>
      </html>
    `;

    // Write the merged code to the iframe
    doc.open();
    doc.write(fullCode);
    doc.close();
  };

  // Execute JavaScript and log the output
  const handleConsoleOutput = () => {
    const jsCode = editorRef.current.getValue();

    // Create a safe execution environment
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const iframeWindow = iframe.contentWindow;
    const iframeDocument = iframe.contentDocument;

    // Redirect console.log to capture output
    iframeWindow.console.log = (message) => {
      setConsoleOutput((prev) => [...prev, `> ${message}`]);
    };

    // Run the JavaScript code inside the iframe
    try {
      iframeWindow.eval(jsCode);
    } catch (error) {
      setConsoleOutput((prev) => [...prev, `Error: ${error.message}`]);
    }

    // Cleanup iframe
    document.body.removeChild(iframe);
  };

  // Clear the console output
  const clearConsole = () => {
    setConsoleOutput([]);
  };

  return (
    <div className="p-1 shadow-lg flex-col">
      {/* Language Selector */}
      <div className="flex mb-1 font-bold">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-1 mr-2 border text-center rounded-sm focus:outline-none text-cyan-700 font-bold"
        >
          <option value="htmlmixed">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
        </select>
        {/* Action Buttons */}
        <div className="flex space-x-6 ml-96">
          <button
            onClick={handleViewResult}
            className="px-4 py-2 bg-pink-500 text-white rounded-sm hover:bg-pink-700"
          >
            View Result
          </button>
          <button
            onClick={handleClearScreen}
            className="px-4 py-2 bg-red-700 text-white rounded-sm hover:bg-red-900"
          >
            Clear Screen
          </button>
          <button
            onClick={handleConsoleOutput}
            className="px-4 py-2 bg-cyan-600 text-white rounded-sm hover:bg-cyan-800"
          >
            Console Output
          </button>
          <button
            onClick={clearConsole}
            className="px-4 py-2 bg-purple-600 text-white rounded-sm hover:bg-purple-500"
          >
            Clear Console
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <textarea
        id="realtimeEditor"
        className="w-full h-72 text-base font-mono text-white bg-transparent border-2 focus:outline-none transition-all"
      ></textarea>

      {/* Output and Console Side by Side */}
      <div className="flex w-full">
        {/* Console Output */}
        <div className="w-1/2 p-2 bg-gray-900 text-white h-72 overflow-y-scroll mr-2">
          <h3 className="text-lg font-bold">Console Output:</h3>
          <ul>
            {consoleOutput.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Output Display */}
        <iframe
          id="outputFrame"
          title="Output"
          className="w-1/2 h-72 border bg-white"
        ></iframe>
      </div>
    </div>
  );
};

export default Editor;
