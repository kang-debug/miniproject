import React from 'react'
import moleImg from './Game1.png'
import './Game1.css'

export default function Mole({show}) {
    return (
        <img src={moleImg} alt="mole" className={`mole ${show ? 'show' : 'hidden'}`}/>
    )
}