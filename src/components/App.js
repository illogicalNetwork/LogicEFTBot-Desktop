import React from 'react';
import Search from './Search';
import Store from './Store';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, createTheme } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	grid: {
		width: '100%',
		margin: '0px',
		background: '#23272A'
	}
}));

const App = () => {
	const classes = useStyles(createTheme);
	return (
		<Store>
			<Grid container spacing={2} className={classes.grid}>
				<Search />
			</Grid>
		</Store>
	)
}

export default App
