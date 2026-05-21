import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface A2FFrame {
  time: number;
  blendshapes: Record<string, number>;
}

export function useA2FStream(
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  frames: A2FFrame[],
  headMesh: THREE.SkinnedMesh | null,
  teethMesh: THREE.SkinnedMesh | null
) {
  const currentFrameIndexRef = useRef(0);

  useEffect(() => {
    // Reset index when new frames arrive
    currentFrameIndexRef.current = 0;
  }, [frames]);

  const updateBlendshapes = () => {
    const audio = audioRef.current;
    if (!audio || !headMesh || frames.length === 0) return;

    const currentTime = audio.currentTime;

    // Find the correct frame interval
    let idx = currentFrameIndexRef.current;
    while (idx < frames.length - 1 && frames[idx + 1].time < currentTime) {
      idx++;
    }
    currentFrameIndexRef.current = idx;

    const currentFrame = frames[idx];
    const nextFrame = frames[Math.min(idx + 1, frames.length - 1)];

    // Calculate interpolation factor (0 to 1)
    let lerpFactor = 0;
    if (nextFrame.time > currentFrame.time) {
      lerpFactor = (currentTime - currentFrame.time) / (nextFrame.time - currentFrame.time);
      lerpFactor = THREE.MathUtils.clamp(lerpFactor, 0, 1);
    }

    // Apply interpolated blendshapes
    Object.keys(currentFrame.blendshapes).forEach((shapeName) => {
      const targetIndex = headMesh.morphTargetDictionary?.[shapeName];
      const teethIndex = teethMesh?.morphTargetDictionary?.[shapeName];

      if (targetIndex !== undefined) {
        const val1 = currentFrame.blendshapes[shapeName];
        const val2 = nextFrame.blendshapes[shapeName];
        const interpolatedVal = THREE.MathUtils.lerp(val1, val2, lerpFactor);

        headMesh.morphTargetInfluences![targetIndex] = interpolatedVal;
        
        if (teethIndex !== undefined && teethMesh) {
          teethMesh.morphTargetInfluences![teethIndex] = interpolatedVal;
        }
      }
    });
  };

  return { updateBlendshapes };
}
