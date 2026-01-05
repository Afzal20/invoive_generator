"use client"
import { Button } from './ui/button'
import { redirect } from 'next/navigation'

function GetStartButton() {
    return (
        <Button
            className="rounded-full">
            Get Started
        </Button>
    )
}

export default GetStartButton; 
