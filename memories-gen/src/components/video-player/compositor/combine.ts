import VideoContext from 'videocontext';


export function Combine(videoContext) {
  return videoContext.compositor(VideoContext.DEFINITIONS.COMBINE);
}
// export const Combine = VideoContext.DEFINITIONS.COMBINE;