import React from "react";
import { Composition } from "remotion";
import { DURATION, Video } from "./Video";
import { AD_FRAMES, AdVideo } from "./ad/AdVideo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Certifs" component={Video} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
    <Composition id="Ad" component={AdVideo} durationInFrames={AD_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
