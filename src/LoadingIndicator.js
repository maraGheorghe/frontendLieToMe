import { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
    const [dots, setDots] = useState(1);
    const [currentText, setCurrentText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const initialLoadingTexts = [
        "Reading between the lines, and the pixels too",
        "Just casually unraveling the fabric of deceit",
        "Finding out if Pinocchio has been here",
    ];

    const almostDoneTexts = "Almost done";
    const finalText = "Assembling the result";

    // Random initial message
    useEffect(() => {
        const randomInitialText = initialLoadingTexts[Math.floor(Math.random() * initialLoadingTexts.length)];
        setCurrentText(randomInitialText);
        setDots(1);
    }, []);

    // Change to almost done message after a few seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentText(almostDoneTexts);
            setDots(1);
        }, 5000);  // Change this value to set the time before the text changes

        return () => clearTimeout(timeout);
    }, []);

    // Change to final message after a few more seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentText(finalText);
            setDots(1);
        }, 10000);  // Change this value to set the time before the text changes

        return () => clearTimeout(timeout);
    }, []);

    // Rotate the number of dots between 1 and 3
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => prevDots === 3 ? 1 : prevDots + 1);
        }, 2000); // Change this value to set the interval of dot changes

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='loader'>
            <BeatLoader
                color="#6DCFF6"
                height={25}
                width={5}
            />
            <p>{currentText}{'.'.repeat(dots)}</p>
        </div>
    );
};

export default LoadingIndicator;
