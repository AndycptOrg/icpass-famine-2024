import React, { useState } from 'react';
import { Button, Paper, TextField, MenuItem } from '@mui/material';
import { ThemeProvider,createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { setDoc, doc } from 'firebase/firestore';

import { db, auth, signInIfNeeded } from '../database/firebase';

export default function NewUser(props) {
  const theme_3 = createTheme({
    typography: {
      fontFamily:'Ubuntu'
    }
  });
  const [name, setName] = useState("");
  
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  function generateString(length) {
      let result = ' ';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const id = generateString(20);

    /* Randomize Stats*/
    const educations = [
      {education: 0, pct: 12}, // Primary    60%
      {education: 1, pct: 7},  // Secondary  30%
      {education: 2, pct: 1},  // University 5%
      {education: 3, pct: 0}   // Graduate   0%
    ];

    const moneyList = [
      {money: 100, pct: 14},
      {money: 200, pct: 5},
      {money: 500, pct: 1},
    ];

    const foods = [
      {food: 2, pct: 7},
      {food: 6, pct: 10},
      {food: 10, pct: 3},
    ];
    
    function handleRandom(table) {
      const expanded = table.flatMap(entry => Array(entry.pct).fill(entry));
      return expanded[Math.floor(Math.random() * expanded.length)];
    }
  

    (async () => {
      // make sure we're signed in and have a UID to attach as owner
      try {
        await signInIfNeeded();
      } catch (e) {
        console.error('Cannot create user without auth', e);
        return;
      }
      const ownerUid = auth.currentUser ? auth.currentUser.uid : null;

      await setDoc(doc(db, "users", id), {
      name: name,
      group: group,
      charityFood: 0,
      food: handleRandom(foods).food,
      happiness: 5,
      money: handleRandom(moneyList).money,
      education: handleRandom(educations).education,
      charity: 0,
      married: false,
      // owner is the auth uid that created this document; used by rules
      owner: ownerUid,
    });
    props.setId(id);
    })();
  }

  const [group, setGroup] = useState('');

  return (
    <>	
    <ThemeProvider theme = {theme_3}>
      <Paper elevation={0}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
            <Grid item xs={8}>
              <TextField 
                required
                id="name-textfield"
                variant="outlined"
                sx={{width: '20em'}}
                size="large"
                label="Name"
                onChange={e => setName(e.target.value)}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                required
                id="group-select"
                size='large'
                value={group}
                label="Group"
                onChange={e => { setGroup(e.target.value) }}
                sx={{width: '20em'}}
                select
                fullWidth
                margin='dense'
              >
                {
                  Array.from({length: 10}, (_, i) => i + 1).map((i) => 
                    <MenuItem key={i} value={i}>Group {i}</MenuItem>
                  )
                }
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <Button
                variant="contained"
                type="submit"
                sx={{width: '20em'}}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
    </>
  );
}