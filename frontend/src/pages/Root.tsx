import { Outlet, useLocation, useMatch } from "react-router-dom"
import NavBar from "../components/NavBar";

export const Root = () => {

  return (
    <>
      <NavBar/>
      <Outlet />
    </>
  )
}