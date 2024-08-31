import React from 'react'
import moleImg from './mole.png'
import './Game1.css'

export default ({show}) => {
    return (
        <img src={moleImg} alt="mole" className={`mole ${show ? 'show' : 'hidden'}`}/>
    )
}