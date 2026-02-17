import { useRef } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import "../Pages/Register.css";

function Register() {
  const navigate = useNavigate();
  const userNameDom = useRef();
  const firstNameDom = useRef();
  const lastNameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const usernameValue = userNameDom.current.value;
    const firstValue = firstNameDom.current.value;
    const lastValue = lastNameDom.current.value;
    const emailValue = emailDom.current.value;
    const passValue = passwordDom.current.value;

    if (
      !usernameValue ||
      !firstValue ||
      !lastValue ||
      !emailValue ||
      !passValue
    ) {
      alert("please provide all required values");
      return;
    }
    try {
      await axios.post("/users/register", {
        username: usernameValue,
        firstname: firstValue,
        lastname: lastValue,
        email: emailValue,
        PASSWORD: passValue,
      });
      alert("user registered successfully");
      navigate("/login");
    } catch (error) {
      alert("something went wrong, try again");
      console.log(error.response);
    }
  }
  return (
    <section className="section">
      <form className="myform" onSubmit={handleSubmit}>
        <div className="username">
          <span className="span">user name </span>
          <input
            className="span"
            ref={userNameDom}
            type="text"
            placeholder="username"
          />
        </div>
        <br />
        <div>
          <span className="span">first name </span>
          <input
            className="span"
            ref={firstNameDom}
            type="text"
            placeholder="first name"
          />
        </div>
        <br />
        <div>
          <span className="span">last name </span>
          <input
            className="span"
            ref={lastNameDom}
            type="text"
            placeholder="last name"
          />
        </div>
        <br />
        <div>
          <span className="span">email </span>
          <input
            className="span"
            ref={emailDom}
            type="email"
            placeholder="email"
          />
        </div>
        <br />
        <div>
          <span className="span">password </span>
          <input
            className="span"
            ref={passwordDom}
            type="password"
            placeholder="password"
          />
        </div>
        <button className="button" type="submit">
          Register
        </button>
      </form>
      <Link to={"/login"} className="login">
        {" "}
        login
      </Link>
    </section>
  );
}

export default Register;
