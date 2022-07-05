import React, { CSSProperties } from "react";
interface Icomponent{
    className:string,
    style:CSSProperties
}
function withStyles(Component:React.FunctionComponent<any>,classes:string) {
    return function(){
        return <Component className={classes}/>   
    }
}
export default withStyles;