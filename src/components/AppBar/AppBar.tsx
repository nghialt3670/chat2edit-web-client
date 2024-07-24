import { useEffect } from "react";
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
import { useConvStore, useLayoutStore, useUserStore } from "../../stores";
import { fetchImageAsDataURL } from "../../utils/file";
import { getUser } from "../../api";
import { Conversation } from "../../models";

export default function AppBar() {
  const convStore = useConvStore();
  const userStore = useUserStore();
  const layoutStore = useLayoutStore();
  // const { theme, toggleTheme, toggleSidebar } = useLayoutStore((state) => ({
  //   theme: state.theme,
  //   toggleTheme: state.toggleTheme,
  //   toggleSidebar: state.toggleSidebar,
  // }));
  const { isSignedIn, getToken } = useAuth();
  const user = useUser();

  useEffect(() => {
    const updateAppState = async () => {
      if (user.isSignedIn) {
        try {
          userStore.setAvatarDataURL(
            await fetchImageAsDataURL(user.user.imageUrl),
          );

          const jwt = await getToken();
          if (!jwt) throw Error("Can not get JWT");

          const userResponse = await getUser(jwt);

          if (layoutStore.theme !== userResponse.settings.theme)
            layoutStore.toggleTheme();

          convStore.setConvs(
            userResponse.convs.map((conv) => ({
              id: conv.id,
              title: conv.title,
              messages: [],
              lastSentTimestamp: conv.lastSentTimestamp,
            })),
          );

          convStore.createNewConv();
        } catch (error: unknown) {
          if (error instanceof Error) console.log(error.message);
          else console.log("Unknow error");
        }
      }
    };
    if (isSignedIn) {
      updateAppState();
    }
  }, [isSignedIn]);

  return (
    <div className={classes.main}>
      <div className={classes.toggle_button_container}>
        <IconButton onClick={layoutStore.toggleSidebar}>
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
