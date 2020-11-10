import React from 'react';
import {
    Card,
    CardContent,
    Typography,
  } from "@material-ui/core";

import "./InfoBox.css"

//BEM (Block, Element, Modifier is a popular naming convention in classes in HTML and CSS)
// __ (undersocre undersocre) stands for element change
// -- (dash dash) stands for modification of the element
// source (example): http://getbem.com/naming/ 

/*
        <Card 
            onClick = {props.onClick} 
            className = {`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}
        >
*/

function InfoBox({title, cases, isRed, active, total, ...props}) {
    return (
        <Card 
            onClick = {props.onClick}
            className = {"infoBox"} 
            
        >

            <CardContent>
                <Typography className = "infoBox__titel" color = "textSecondary">
                    {title}

                </Typography>
{/* {<h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>} */}
                
                <h2 className = "infoBox__cases">
                    {cases}
                </h2>

                <Typography className = "infoBox__total" color = "textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
};

export default InfoBox