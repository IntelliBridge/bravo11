import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  CardContent,
  Grid,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { EmojiClickData } from "emoji-picker-react";

// project imports
import ChartHistory from "../../views/application/chat/ChartHistory";

import Loader from "components/ui/Loader";
import MainCard from "components/ui/cards/MainCard";

import { useDispatch, useSelector } from "store/slices/legacy";
import { openDrawer } from "store/slices/legacy/menu";
import { getUser, getUserChats, insertChat } from "store/slices/legacy/chat";
import { gridSpacing } from "store/slices/legacy/constant";

import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";

// types
import { UserProfile } from "types/user-profile";
import { History as HistoryProps } from "types/chat";

import "mapbox-gl/dist/mapbox-gl.css";

// ==============================|| APPLICATION CHAT ||============================== //

const ChatMainPage = () => {
  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const scrollRef = useRef();

  useLayoutEffect(() => {
    if (scrollRef?.current) {
      // @ts-ignore
      scrollRef.current.scrollIntoView();
    }
  });

  const [user, setUser] = useState<UserProfile>({});
  const [data, setData] = React.useState<HistoryProps[]>([]);
  const chatState = useSelector((state) => state.chat);

  useEffect(() => {
    setUser(chatState.user);
  }, [chatState.user]);

  useEffect(() => {
    setData(chatState.chats);
  }, [chatState.chats]);

  useEffect(() => {
    // hide left drawer when email app opens

    const drawerToggler = dispatch(openDrawer(false));
    const userCall = dispatch(getUser(1));
    Promise.all([drawerToggler, userCall]).then(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getUserChats(user.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // handle new message form
  const [message, setMessage] = useState("");
  const handleOnSend = () => {
    const d = new Date();
    setMessage("");
    const newMessage = {
      from: "User1",
      to: user.name,
      text: message,
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setData((prevState) => [...prevState, newMessage]);
    dispatch(insertChat(newMessage));
  };

  const handleEnter = (
    event: React.KeyboardEvent<HTMLDivElement> | undefined
  ) => {
    if (event?.key !== "Enter") {
      return;
    }
    handleOnSend();
  };

  if (loading) return <Loader />;

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs zeroMinWidth sx={{ display: "flex" }}>
          <MainCard
            sx={{
              // bgcolor: theme.palette.mode === "dark" ? "dark.main" : "grey.50",
              bgcolor: theme.palette.mode === "dark" ? "dark.main" : "grey.50",
              padding: 0,
            }}
          >
            <Grid container spacing={gridSpacing}>
              <PerfectScrollbar
                style={{
                  width: "100%",
                  height: "calc(100vh - 440px)",
                  overflowX: "hidden",
                  minHeight: 525,
                }}
              >
                <CardContent>
                  <ChartHistory theme={theme} user={user} data={data} />
                  {/* @ts-ignore */}
                  <span ref={scrollRef} />
                </CardContent>
              </PerfectScrollbar>
              <Grid item xs={12}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} sm zeroMinWidth>
                    <OutlinedInput
                      id="message-send"
                      fullWidth
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleEnter}
                      placeholder="Type a Message"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            disableRipple
                            color="primary"
                            onClick={handleOnSend}
                            aria-label="send message"
                          >
                            <SendTwoToneIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                      aria-describedby="search-helper-text"
                      inputProps={{ "aria-label": "weight" }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatMainPage;
