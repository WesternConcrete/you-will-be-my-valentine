"use client"

import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import { cn } from "./lib/utils";
import "./styles/vintage.css";
import { AnimatePresence, MotionConfig } from "framer-motion"
import { framerMotionConfig } from "./lib/framer";
import { motion } from "framer-motion" // Correct import for framer-motion
import { motion as motion3d } from "framer-motion-3d"

import Background from "./components/Background";
import LoadingScreen from "./components/LoadingScreen";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Avatar } from "./components/Avatar";
import { SpotLight } from "@react-three/drei";

// generate 15 random x, y on the screen [-500, 500]
const random_positions = Array.from({ length: 50 }, () => {
  return ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    right: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 100}%`,
  })
});

const AvatarComponent = memo(function AvatarWrapper() {
  const characterGroup = useRef<any>()

  useFrame((state, delta) => {
    if (characterGroup.current) {
      // Rotate the platform
      characterGroup.current.rotation.z += delta * 0.8;
    }
  });

  const { viewport } = useThree();
  return (
    <motion3d.group position={[0, -.33269999999999998, .530023441690156]} rotation={[-.4 * 3.1415926535897927, 0, 0]}
      transition={{
        duration: 0.6,
      }}
      variants={{
        0: {
          scaleX: 0.9,
          scaleY: 0.9,
          scaleZ: 0.9,
          rotateX: 0,
          rotateY: Math.PI / 2,
          rotateZ: Math.PI / 2,
        },

      }}
      ref={characterGroup}

    >
      <Avatar animation={"Falling"} />
    </motion3d.group>
  )

}, (prev, next) => true)

export default function Home() {
  const [playAudio, setPlayAudio] = useState(false);
  const [showAnimations, setShowAnimations] = useState(false);
  const [noButtonPositionIndex, setNoButtonPositionIndex] = useState<number>(-1);

  // Define exit animations for buttons
  const buttonExitAnimations = {
    opacity: 0,
    x: [0, -1000], // Change values as needed to move buttons out of screen
    transition: { duration: 0.5 },
  };

  useEffect(() => {
    if (playAudio) {
      setTimeout(() => {
        setShowAnimations(true)
      }, 1000)
    }
  }, [playAudio])

  const [started, setStarted] = useState(false);


  return (
    <body className="relative">
      <LoadingScreen started={started} setStarted={setStarted} />
      <MotionConfig transition={{ ...framerMotionConfig }}>
        <Canvas shadows>
          <ambientLight intensity={2} />
          <motion3d.group
            animate={{
              rotateY: [0, Math.PI * 2], // Complete a full rotation around the Y-axis
              x: [0, 1, 0], // Slight movement on the x-axis back and forth
              opacity: 1,
            }}
            transition={{
              rotateY: {
                repeat: Infinity,
                duration: 5, // Duration of one full rotation
                ease: "linear" // For a smooth, continuous rotation
              },
              x: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2, // Duration of the back-and-forth movement
                ease: "easeInOut"
              },
              default: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 2
              }
            }}>
            {showAnimations && <>
              <SpotLight color={"red"} position={[-2, 4, -2]} castShadow />
              <SpotLight color={"purple"} position={[4, 4, -3]} castShadow />
              <SpotLight color={"red"} position={[0, 4, 2]} castShadow />
              <SpotLight color={"purple"} position={[-4, 4, -1]} castShadow />
              <SpotLight color={"red"} position={[2, 4, 5]} castShadow />
            </>
            }
          </motion3d.group>



          <Background triggerAnimation={playAudio} />
          <motion3d.group
            initial="initial"
            animate={{ y: !playAudio ? 20 : 0 }}
            transition={{ duration: 1.2, type: "tween" }}
          >
            <AvatarComponent />
          </motion3d.group>
        </Canvas>
      </MotionConfig>
      <div className="absolute left-20 right-20 top-20 bottom-20">
        <div className="flex items-center justify-center relative w-full h-full">
          <motion.div animate={{ y: playAudio ? -1000 : 0, opacity: playAudio ? 0 : 1 }}
            transition={{ duration: 0.5 }}>
            <Image
              className="relative pb-72 scale-90 select-none"
              src="/message.gif"
              alt="Will you be my valentine"
              width={800}
              height={200}
              priority
            />
          </motion.div>
          {showAnimations && <motion.div initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 }
            }}
            transition={{ duration: 1.2, delay: 1 }} // Delay is in seconds, not milliseconds

          >
            <Image
              className="relative pb-96 scale-75 select-none"
              src="/lets-go.gif"
              alt="Lets goooo!"
              width={800}
              height={200}
              priority
            />
          </motion.div>}

          <div className="flex flex-row justify-center">
            <motion.div
              className="absolute left-96"
              animate={{ x: playAudio ? -1000 : 0, opacity: playAudio ? 0 : 1 }}
              transition={{ duration: 0.5 }}>
              <button className="old-button" onClick={() => setPlayAudio(true)}>
                Yes!
              </button>
            </motion.div>
            {showAnimations && <motion.div
              initial="initial"
              animate="animate"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 }
              }}
              transition={{ duration: 1.2, delay: 1 }}
              className="absolute left-20 bottom-0">
              <button className="old-button whitespace-nowrap" onClick={() => location.reload()}>
                Go back
              </button>
            </motion.div>}

            <motion.div
              className="absolute right-96"
              style={noButtonPositionIndex >= 0 ? {
                top: random_positions[noButtonPositionIndex].top,
                left: random_positions[noButtonPositionIndex].left,
                right: random_positions[noButtonPositionIndex].right,
                bottom: random_positions[noButtonPositionIndex].bottom,
              } : {}}
              onMouseOver={() => {
                setNoButtonPositionIndex((index) => {
                  const next_index = (index + 1) % random_positions.length
                  return next_index
                })
              }}
              key={noButtonPositionIndex}
              animate={{ x: playAudio ? 1000 : 0, opacity: playAudio ? 0 : 1 }}
              transition={{ duration: 0.5 }}>
              <button className="old-button">
                No!
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </body>
  );
}
