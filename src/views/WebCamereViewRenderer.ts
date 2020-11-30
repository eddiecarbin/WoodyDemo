import { GameParam } from "../models/AppData";

export class WebCameraViewRenderer {

    public video: HTMLVideoElement;

    public initialize(): Promise<boolean> {
        console.log("WebCameraViewRenderer")
        return new Promise<boolean>(async (resolve, reject) => {
            this.video = document.getElementById('video') as HTMLVideoElement;
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                var hint: any = {
                    "audio": false,
                    "video": {
                        facingMode: 'environment',
                        width: { min: GameParam.screenWidth, max: GameParam.screenWidth }
                    }
                };
                // if (window.innerWidth < 800) {
                //     var width = (window.innerWidth < window.innerHeight) ? 240 : 360;
                //     var height = (window.innerWidth < window.innerHeight) ? 360 : 240;

                //     var aspectRatio = window.innerWidth / window.innerHeight;
                //     hint = {
                //         "audio": false,
                //         "video": {
                //             facingMode: 'environment',
                //             width: { min: width, max: width }
                //         },
                //     };

                navigator.mediaDevices.getUserMedia(hint).then(async (stream) => {
                    this.video.srcObject = stream;
                    this.video = await new Promise<HTMLVideoElement>((resolve, reject) => {
                        this.video.onloadedmetadata = () => resolve(this.video);
                    })
                    // console.log('video', this.video, this.video.videoWidth, this.video.videoHeight);
                    // this.video.play();
                }).catch((error) => {
                    console.error(error);
                    reject(error);
                });

                resolve(true);
            }
            else {
                reject("No navigator.mediaDevices && navigator.mediaDevices.getUserMedia");
            }
        });

    }
}