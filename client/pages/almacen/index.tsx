import {
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

export default function Home() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={6}>
          <List>
            <ListItem
              secondaryAction={
                <Box display="flex" justifyContent="center" alignItems="center">
                  <IconButton>
                    <KeyboardArrowUp />
                  </IconButton>
                  0
                  <IconButton>
                    <KeyboardArrowDown />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary="Milanesas" />
            </ListItem>
            <ListItem
              secondaryAction={
                <Box display="flex" justifyContent="center" alignItems="center">
                  <IconButton>
                    <KeyboardArrowUp />
                  </IconButton>
                  0
                  <IconButton>
                    <KeyboardArrowDown />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary="Milanesas" />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}
