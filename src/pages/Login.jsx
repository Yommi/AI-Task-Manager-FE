import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;
const environment = import.meta.env.VITE_ENV;

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email: values.email,
        password: values.password,
      });
      environment === "development" && console.log(response);
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      setStatus(null);
      navigate("/tasks");
    } catch (err) {
      setStatus("Invalid email or password");
      if (environment === "development") {
        console.log(err);
      } else {
        console.log(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold text-purple-500">Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange
      >
        {({ isSubmitting, isValid, touched, errors, status }) => (
          <Form noValidate className="flex flex-col gap-y-10 mt-5 w-[50%]">
            {/* Email */}
            <div>
              <Field
                className={tailwind.field}
                name="email"
                placeholder="Email"
                type="email"
                autoComplete="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className={tailwind.errorMsg}
              />
            </div>

            {/* Password */}
            <div>
              <Field
                className={tailwind.field}
                name="password"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className={tailwind.errorMsg}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full border-bottom rounded text-white px-5 py-2 bg-purple-500 cursor-pointer hover:bg-purple-600 hover:font-semibold"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? (
                  <ClipLoader loading={isSubmitting} size={26} color="white" />
                ) : (
                  "Submit"
                )}
              </button>
              {status && (
                <div className="text-red-500 text-center mt-2">{status}</div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const tailwind = {
  field: "px-5 py-2 border rounded w-full bg-white",
  errorMsg: "text-red-500",
};

export default Login;
