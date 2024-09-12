"use client"
import React from "react";

interface Props {
    title: string;
}

const Titlebar: React.FC<Props> = ({title}) =>{
    return (
        <title>{title}</title>
    )
}

export default Titlebar;