import React, {useState, useContext} from 'react';
import { ipcRenderer } from 'electron';
import Result from './Result';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Card, CardContent, Fade } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab'
import { Context } from './Store';
import '../App.css'
import logo from '../../assets/logic_logo.png';

const useStyles = makeStyles((theme) => ({
	grid: {
		width: '100%',
		margin: '0px',
		background: '#23272A'
	},
	paper: {
		padding: theme.spacing(2),
        background: 'lightgrey'
	},
	text: {
		width: '100%',
        color: 'white',
	},
    root: {
        width: '100%',

        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
          borderColor: "lightgray"
        },
        
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "lightgray"
        },
         "& .MuiInputLabel-outlined.Mui-focused": {
          color: "lightgray"
        }
      },
    logoImg: {
        "& img": {
            width: '10rem',
        }        
    },
    card:{
        width: '100vw',
        backgroundColor: '#191919'
    },
    introCard: {
        backgroundColor: '#191919',
        color: '#ffffff'
    },
    formLabel: {
        color: '#fff',
        '& .Mui-hover': {
          color: '#fff'
        }
      }

}));

const Search = () => {
    const classes = useStyles();
    const [alertNoItem, setNoItem] = useState(false);
    const [alertSayLess, setSayLess] = useState(false);
    const [fade, setFade] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [eftItems, setItems] = useContext(Context);

    const noItem = () => {
        setNoItem(true);
        setFade(true);
        setTimeout(() => setFade(false), 5000);
        setTimeout(() => setNoItem(false), 5150);
    }
    const sayLess = () => {
        setSayLess(true);
        setFade(true);
        setTimeout(() => setFade(false), 5000);
        setTimeout(() => setSayLess(false), 5150);
    }


    const handleChange = (e) => {
        e.persist();
        if(searchVal.length < 250) {
         setSearchVal(e.target.value);
        } else if(e.target.value.length < searchVal.length){
            setSearchVal(e.target.value);
        } else {
            sayLess();
            return;
        }
        
    }

    const handleHttp = (searchTerm) => {
        ipcRenderer.invoke('getItems', searchTerm);

        ipcRenderer.once('receiveItems', (e, items) => {
            if(items !== null) {
                setItems(items);
            } else {
                noItem();
            }
        })
    }

    const submitSearch = (e) => {
        e.persist();
        if(e.key === 'Enter' && searchVal !== '' && searchVal.length < 250) {
            handleHttp(searchVal);
            setSearchVal('');
        } else if(e.key === 'Enter' && searchVal.length > 250) {
            sayLess();
            return;
        } else {
            return;
        }
        
    }

    return (
        <Card className={classes.card} variant="outlined">
            <CardContent>
            <Grid container spacing={1}>
                
                <Grid item xs={10}>
                    <h2 className={classes.text}>LogicEFTBot Desktop</h2>
                </Grid>
                <Grid item className={classes.logoImg} xs={2}>
                    <img src={logo} />
                </Grid>

                <Grid item xs={12}>
                 
                        <TextField InputLabelProps={{className: classes.formLabel}} className={classes.root} id="searchInput" label="Search Item..." variant="outlined" value={searchVal} onKeyDown={submitSearch} onChange={handleChange} />
                    
                </Grid>

                {alertNoItem && 
                <Fade in={fade}>
                    <Grid item xs={12}>
                        <Alert severity="info">
                            <AlertTitle>Item Not Found</AlertTitle>
                        <strong>Try a different search and make sure spelling is correct.</strong>
                        </Alert>
                    </Grid>
                </Fade>}
                {alertSayLess && 
                <Fade in={fade}>
                    <Grid item xs={12}>
                        <Alert severity="info">
                            <AlertTitle>Say Less</AlertTitle>
                        <strong>250 Character Limit Exceeded</strong>
                        </Alert>
                    </Grid>
                </Fade>}
                

                
                <Grid item xs={12}>
                    {Object.keys(eftItems).length !== 0 ? <Result /> : <Card className={classes.introCard} variant="outlined"><CardContent><h4>Enter your search above to get started. (Ex. Slick, 7.62, Igolnik etc) - Data provided by Tarkov-Market.com</h4></CardContent></Card>}
                </Grid>
				

                
			</Grid>
            </CardContent>

        </Card>
            
				
        
    )
}

export default Search
