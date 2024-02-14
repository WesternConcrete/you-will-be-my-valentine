import { useProgress } from "@react-three/drei";
import { useEffect } from "react";

export default function LoadingScreen(props) {
    const { started, setStarted } = props;
    const { progress, total, loaded, item } = useProgress();

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                setStarted(true);
            }, 1000);
        }
    }, [progress, total, loaded, item]);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none
  flex items-center justify-center bg-[#f6e7ff] 
  ${started ? "opacity-0" : "opacity-100"}`}
        >
            <div className="text-4xl md:text-9xl font-bold text-rose-700 relative">
                <div
                    className="absolute left-0 top-0  overflow-hidden truncate text-clip transition-all duration-1000"
                    style={{
                        width: `${progress}%`,
                        height: "110%",
                    }}
                >

                </div>
                <div className="opacity-40"> </div>
            </div>
        </div>
    );
};