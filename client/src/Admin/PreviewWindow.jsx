import { useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";

const PreviewWindow = () => {
  const [userinput, setUserInput] = useState(
    `<h1 style="color: red; font-weight: 900;">Hello World!</h1>`
  );

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [userinput]);

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded shadow-md">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-4 text-blue-500">Preview Window</h1>
      <p className="text-gray-600 mb-4 p-1 text-sm">
        Check how the question will appear in the test.
      </p>

      {/* Input */}
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          name="userinput"
          id="userinput"
          cols="30"
          rows="10"
          onChange={handleChange}
          placeholder="Paste your question here"
          value={userinput}
        />
      </div>

      <hr className="h-1 bg-gray-900" />

      <div className="m-1 p-1 line-numbers">
        <pre>
          <code className="language-html">{userinput}</code>
        </pre>
      </div>

      <hr className="h-1 bg-gray-900" />

      {/* Output */}
      <div className="m-1 p-2">
        <span
          className="text-lg"
          dangerouslySetInnerHTML={{ __html: userinput }}
        />
      </div>
    </div>
  );
};

export default PreviewWindow;
