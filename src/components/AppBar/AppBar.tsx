import React, { useEffect, useState } from "react";
import classes from "./AppBar.module.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button, IconButton, Stack } from "@mui/material";
import { TfiAlignJustify } from "react-icons/tfi";
import { useConvsStore, useLayoutStore, useUserStore } from "../../stores";
import { fetchImageAsDataURL } from "../../utils/file";
import { requestUser } from "../../api";

export default function AppBar() {
  const setAvatarDataURL = useUserStore((state) => state.setAvatarDataURL);
  const setOldConvs = useConvsStore((state) => state.setOldConvs);
  const { theme, toggleTheme, toggleSidebar } = useLayoutStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
    toggleSidebar: state.toggleSidebar,
  }));
  const { isSignedIn, getToken } = useAuth();
  const user = useUser();

  useEffect(() => {
    const updateAppState = async () => {
      if (user.isSignedIn) {
        const dataURL = await fetchImageAsDataURL(user.user.imageUrl);
        setAvatarDataURL(dataURL);

        const token = await getToken();
        if (!token) throw Error();

        const userResponse = await requestUser(token);
        if (theme !== userResponse.settings.theme) toggleTheme();
        setOldConvs(
          userResponse.convs.map((conv) => ({
            id: conv.id,
            title: conv.title,
            messages: [],
          })),
        );
      }
    };
    if (isSignedIn) {
      updateAppState();
    }
  }, [isSignedIn]);

  return (
    <div className={classes.main}>
      <div className={classes.toggle_button_container}>
        <IconButton onClick={toggleSidebar}>
          <TfiAlignJustify />
        </IconButton>
      </div>
      <div className={classes.app_brand_container}>
        <span className={classes.app_name}>Chat2Edit</span>
      </div>
      <div className={classes.sign_in_out}>
        <SignedOut>
          <Stack direction="row" gap={1}>
            <SignInButton mode="modal">
              <Button variant="outlined" color="inherit" size="small">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="contained" color="inherit" size="small">
                Sign Up
              </Button>
            </SignUpButton>
          </Stack>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
