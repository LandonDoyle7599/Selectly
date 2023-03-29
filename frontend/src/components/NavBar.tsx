import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, IconButton, Popover } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AccountIcon } from "./AccountIcon";
import { RouterTabs } from "./RouterTabs";

export const NavBar: FC = () => {
    const {token} = useAuth();

    if(token === null || token === "") return null;

  return (
    <Stack
      direction="row"
      justifyContent="right"
      gap="3rem"
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <RouterTabs />
      <AccountIcon/>
    </Stack>
  );
};

export default NavBar;
