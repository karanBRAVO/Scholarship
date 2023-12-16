import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
  sendWarningMessage,
} from "../utils/notifier.js";

const Admin_addQuestions = () => {
  const adminStatus = useSelector((state) => state.admin);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    testName: "",
    questions: [
      {
        questionText: "",
        questionOption: [
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
        ],
      },
    ],
  });

  const checkFormDataValidity = () => {
    if (formData.testName.length == 0) {
      return false;
    } else if (
      formData.questions.forEach((object, index) => {
        if (object.questionText.length == 0) {
          return false;
        }
        object.questionOption.forEach((option, index) => {
          if (option.answerText.length == 0) {
            return false;
          }
        });
      })
    ) {
      return false;
    }
    return true;
  };

  const handleChange = (e, questionIndex, optionIndex) => {
    const { name, value, type, checked } = e.target;

    if (name === "questionText") {
      setFormData((prevData) => ({
        ...prevData,
        questions: prevData.questions.map((question, idx) =>
          idx === questionIndex ? { ...question, [name]: value } : question
        ),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        questions: prevData.questions.map((question, idx) =>
          idx === questionIndex
            ? {
                ...question,
                questionOption: question.questionOption.map((option, optIdx) =>
                  optIdx === optionIndex
                    ? {
                        ...option,
                        [name]: type === "checkbox" ? checked : value,
                      }
                    : option
                ),
              }
            : question
        ),
      }));
    }
  };

  const handleAddQuestion = () => {
    setFormData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          questionText: "",
          questionOption: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
          ],
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = adminStatus.token;

    if (checkFormDataValidity() && token.length > 0) {
      try {
        const res = await axios.post(
          "/api/admin/add-question",
          {
            testName: formData.testName,
            question: [...formData.questions],
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        );

        if (res.data.success) {
          sendSuccessMessage(res.data.message);
        } else {
          sendWarningMessage(res.data.error);
          sendInfoMessage("Error");
        }
      } catch (error) {
        sendErrorMessage("Error submitting");
      }
    } else {
      sendWarningMessage("All fields are required");
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">
        Add Questions
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="testName" className="block text-gray-600">
            Test Name:
          </label>
          <input
            type="text"
            id="testName"
            name="testName"
            value={formData.testName}
            autoComplete="off"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => {
              setFormData((prev) => {
                return { ...prev, testName: e.target.value };
              });
            }}
            required
          />
        </div>

        {formData.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-6">
            <label
              htmlFor={`questionText-${questionIndex}`}
              className="block text-gray-600"
            >
              Question {questionIndex + 1}:
            </label>
            <textarea
              id={`questionText-${questionIndex}`}
              name="questionText"
              autoComplete="off"
              value={question.questionText}
              onChange={(e) => handleChange(e, questionIndex)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
              cols="30"
              rows="10"
            ></textarea>

            <div className="mt-4">
              {question.questionOption.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    id={`answerText-${questionIndex}-${optionIndex}`}
                    name="answerText"
                    autoComplete="off"
                    value={option.answerText}
                    onChange={(e) =>
                      handleChange(e, questionIndex, optionIndex)
                    }
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 mr-4"
                    required
                  />
                  <label
                    htmlFor={`isCorrect-${questionIndex}-${optionIndex}`}
                    className="text-gray-600"
                  >
                    Correct Answer
                  </label>
                  <input
                    type="checkbox"
                    id={`isCorrect-${questionIndex}-${optionIndex}`}
                    name="isCorrect"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      handleChange(e, questionIndex, optionIndex)
                    }
                    className="ml-2"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 m-1 py-2 rounded-md hover:bg-blue-600 mb-4"
          onClick={handleAddQuestion}
        >
          {isLoading ? (
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-r-2 border-b-2"></div>
              <p className="text-white">Wait ...</p>
            </div>
          ) : (
            <span>Add Another Question</span>
          )}
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 m-1 py-2 rounded-md hover:bg-blue-600"
        >
          {isLoading ? (
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-r-2 border-b-2"></div>
              <p className="text-white">Loading ...</p>
            </div>
          ) : (
            <span>Add Questions</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Admin_addQuestions;
