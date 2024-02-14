/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useVideoTexture } from '@react-three/drei'

function VideoMaterial({ url }: { url: string }) {
    const texture = useVideoTexture(url)
    return <meshBasicMaterial map={texture} toneMapped={false} />
}

const startingRotation = {
    x: 0,
    y: 0,
    z: 0
}
const endingRotation = {
    x: - Math.PI / 2.5,
    y: 0,
    z: 0
}

const startingPosition = {
    x: 0,
    y: 0,
    z: 0
};
const endingPosition = {
    x: 0,
    y: 0,
    z: -5 // Move backwards along the z-axis
};

const endingDimensions = {
    width: 10,
    height: 10,
    depth: .2 // Move backwards along the z-axis
};

export default function Background({ triggerAnimation }: { triggerAnimation: boolean }) {
    const mesh = useRef<any>();
    const [isAnimating, setIsAnimating] = useState(false);
    const [rotationProgress, setRotationProgress] = useState(0); // Progress: 0 (start) to 1 (end)
    const [isRotatingPlatform, setIsRotatingPlatform] = useState(false);

    const [dimensions, setDimensions] = useState([
        13, 8, .2,
    ]);


    useEffect(() => {
        if (triggerAnimation) {
            setIsAnimating(true);
            setRotationProgress(0); // Reset progress to start the animation
        }
    }, [triggerAnimation]);

    useFrame((state, delta) => {
        if (isAnimating && mesh.current) {
            // Calculate new progress
            let progress = rotationProgress + delta * 0.5; // Adjust delta multiplier for speed
            if (progress >= 1) {
                progress = 1;
                setIsAnimating(false); // Stop the animation when it completes
                setIsRotatingPlatform(true)
            }
            setRotationProgress(progress);

            const interpolatedPosition = {
                x: startingPosition.x + (endingPosition.x - startingPosition.x) * progress,
                y: startingPosition.y + (endingPosition.y - startingPosition.y) * progress,
                z: startingPosition.z + (endingPosition.z - startingPosition.z) * progress,
            };

            // Apply the interpolated position to the mesh
            mesh.current.position.x = interpolatedPosition.x;
            mesh.current.position.y = interpolatedPosition.y;
            mesh.current.position.z = interpolatedPosition.z;

            // Interpolate between starting and ending rotations
            const interpolatedRotation = {
                x: startingRotation.x + (endingRotation.x - startingRotation.x) * progress,
                y: startingRotation.y + (endingRotation.y - startingRotation.y) * progress,
                z: startingRotation.z + (endingRotation.z - startingRotation.z) * progress,
            };

            // Apply the interpolated rotation to the mesh
            mesh.current.rotation.x = interpolatedRotation.x;
            mesh.current.rotation.y = interpolatedRotation.y;
            mesh.current.rotation.z = interpolatedRotation.z;

            setDimensions(old => {
                return [
                    old[0] + (endingDimensions.width - old[0]) * progress,
                    old[1] + (endingDimensions.height - old[1]) * progress,
                    old[2] + (endingDimensions.depth - old[2]) * progress,
                ]
            })

        } else if (isRotatingPlatform && mesh.current) {
            // Rotate the platform
            mesh.current.rotation.z += delta * 0.8; // Adjust delta multiplier for speedxs
        }
    });
    // draw the box
    return (
        <mesh ref={mesh}>
            <boxGeometry args={dimensions as [number, number, number]} />
            <VideoMaterial url="/heart-video.mov" />
        </mesh>
    );
}