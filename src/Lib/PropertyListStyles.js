var imgWidth = 180;
var priceWidth = 130;

module.exports = {
	container: {
		background: "#FFFFFF",
		border: "1px solid #DFDFDF",
		marginTop: 10,
		padding: 10,
	},
	
	imgWrapper: {
		float: "left",
		width: imgWidth,
	},
	
	infoWrapper: {
		marginLeft: imgWidth+10,
		marginRight: priceWidth+10,
	},
	
	propertyName: {
		fontWeight: "bold",
	},
	
	propertyNameLink: {
		color: "#0d3c5f",
		textDecoration: "none",
	},
	
	propertyDescription: {
		fontSize: 12,
	},
	
	priceWrapper: {
		float: "right",
		width: priceWidth,
	},
	
	propertyPrice: {
		fontWeight: "bold",
		fontSize: 16,
		textAlign: "center",
	},
	
	buyBtn: {
		marginTop: 10,
		fontSize: 14,
		//fontWeight: "bold",
		padding: "5px 10px",
		
		background: "#449d44",
		border: "1px solid #398439",
		color: "#fff",
	},
	
	sellBtn: {
		marginTop: 10,
		fontSize: 14,
		//fontWeight: "bold",
		padding: "5px 10px",
		
		background: "#337ab7",
		border: "1px solid #2e6da4",
		color: "#fff",
	},
	
	modalWrapper: {
		position: "fixed",
		width: "100%",
		height: "100%",
		left: 0,
		top: 0,
		background: "rgba(0,0,0, 0.77)",
		zIndex: 100,
	},
	
	modal: {
		background: "#FFFFFF",
		width: 600,
		height: "auto",
		margin: "0 auto",
		padding: 10,
		outline: "5px solid rgba(0,0,0, 0.5)",
	},
	
	periodItem: {
		padding: "1px 5px",
		cursor: "pointer",
		color: "#0d3c5f"
	},
	
	periodItemSelected: {
		background: "#DFDFDF",
		borderBottom: "1px solid #0d3c5f",
		fontWeight: "bold",
	},
};