import React, {useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card } from '@material-ui/core';
import { Context } from './Store';


const useStyles = makeStyles((theme) => ({
	grid: {
		width: '100%',
		margin: '0px',
		background: '#121212'
	},
	paper: {
		padding: theme.spacing(2)
	},
	text: {
		width: '100%'
	},
    eftResultText: {
        color: 'lightgray'
    },
    eftItemHeader: {
        color: 'rgb(0, 102, 255)'
    }
}));

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'RUB',
  });

const Result = () => {
    const classes = useStyles();
    const [eftItems, setItems] = useContext(Context);

    return (

        <Card variant="outlined">
            <Grid container spacing={2} className={classes.grid}>
            
			<Grid item xs={8}>
                 <h2 className={classes.eftItemHeader}>{eftItems.name}</h2>
			</Grid>
			<Grid item xs={4}>
                        <img id="itemImg" src={eftItems.img} alt="" />
			</Grid>

            <Grid item xs={4}>
            <h4 className={classes.eftResultText}>Flea Market Price</h4>
              <p id="fleaMarketPrice" className={classes.eftResultText}>{formatter.format(eftItems.price)}</p>
              
			</Grid>
            <Grid item xs={4}>
            <h4 className={classes.eftResultText}>Trader to sell to</h4>
              <p id="traderToSell" className={classes.eftResultText}>{eftItems.traderName}</p>
			</Grid>
            <Grid item xs={4}>
            <h4 className={classes.eftResultText}>Trader Buying Price</h4>
              <p id="traderBuyPrice" className={classes.eftResultText}>{formatter.format(eftItems.traderPrice)}</p>
			</Grid>

            <Grid item xs={4}>
            <h4 className={classes.eftResultText}>Price Per Slot</h4>
              <p id="pricePerSlot" className={classes.eftResultText}>{formatter.format(eftItems.price / eftItems.slots)}</p>
			</Grid>
            <Grid item xs={4}>
				<h4 className={classes.eftResultText}>7 Day Price AVG</h4>
              <p id="sevenDay" className={classes.eftResultText}>{formatter.format(eftItems.avg7daysPrice)}</p>
			</Grid>
            <Grid item xs={4}>
            <h4 className={classes.eftResultText}>24 Hour Price AVG</h4>
              <p id="pricePerSlot" className={classes.eftResultText}>{formatter.format(eftItems.avg24hPrice)}</p>
			</Grid>
            <Grid item xs={12}>
              <p id="pricePerSlot" className={classes.eftResultText}>Last updated: {new Date(eftItems.updated).toString()}</p>
			</Grid>

		</Grid>
        </Card>
        
    )
}

export default Result
