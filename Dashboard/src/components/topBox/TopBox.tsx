// import React, { useState } from 'react';
// import './topBox.scss';

// const LoginForm: React.FC = () => {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [rememberMe, setRememberMe] = useState<boolean>(true);

//   const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(event.target.value);
//   };

//   const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(event.target.value);
//   };

//   const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRememberMe(event.target.checked);
//   };

//   const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     event.preventDefault();
//     // Handle form submission logic here
//     console.log({ email, password, rememberMe });
//   };

//   return (
//     <form>
//       <div data-mdb-input-init className="form-outline mb-4">
//         <input
//           type="email"
//           id="form2Example1"
//           className="form-control"
//           value={email}
//           onChange={handleEmailChange}
//         />
//         <label className="form-label" htmlFor="form2Example1">Email address</label>
//       </div>

//       <div data-mdb-input-init className="form-outline mb-4">
//         <input
//           type="password"
//           id="form2Example2"
//           className="form-control"
//           value={password}
//           onChange={handlePasswordChange}
//         />
//         <label className="form-label" htmlFor="form2Example2">Password</label>
//       </div>

//       <div className="row mb-4">
//         <div className="col d-flex justify-content-center">
//           <div className="form-check">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               value=""
//               id="form2Example31"
//               checked={rememberMe}
//               onChange={handleRememberMeChange}
//             />
//             <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
//           </div>
//         </div>
//         <div className="col">
//           <a href="#!">Forgot password?</a>
//         </div>
//       </div>

//       <button
//         type="button"
//         data-mdb-button-init
//         data-mdb-ripple-init
//         className="btn btn-primary btn-block mb-4"
//         onClick={handleSubmit}
//       >
//         Sign in
//       </button>

//       <div className="text-center">
//         <p>Not a member? <a href="#!">Register</a></p>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;