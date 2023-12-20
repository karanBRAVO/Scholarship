import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const LoginSignUp = ({ jsxElement, endPoint, showLogin }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.target.classList.contains("cursor-pointer")) {
      navigate(endPoint);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-2 md:p-10">
      {/* Top Container */}
      <div className="bg-blue-400 rounded-t-2xl lg:rounded-2xl lg:fixed lg:right-1/4 lg:top-36 p-5 flex flex-col items-center">
        <img src={logo} className="w-60" alt="" />
        <p className="text-2xl text-yellow-300 font-semibold">
          Ecosysytem test
        </p>
        <p className="text-xl my-5 text-white">
          price{" "}
          <span className="px-3 text-black rounded bg-yellow-300">{"₹"}50</span>
        </p>
        <p className="text-white font-bold text-xl">Scholarship up to 50%</p>
      </div>

      {/* Toggler and Forms */}
      <div className="p-3 border border-blue-400 rounded-b-2xl lg:rounded-2xl lg:p-5">
        <div className="flex gap-4">
          <div
            className={
              showLogin ? "cursor-pointer" : "bg-blue-400 px-2 text-white"
            }
            onClick={handleClick}
          >
            Register
          </div>
          <div
            className={
              showLogin ? "bg-blue-400 px-2 text-white" : "cursor-pointer"
            }
            onClick={handleClick}
          >
            Login
          </div>
        </div>
        <hr className=" h-[2px] bg-blue-900" />

        <div className="mt-6">{jsxElement}</div>
      </div>
    </div>
  );
};

export default LoginSignUp;
