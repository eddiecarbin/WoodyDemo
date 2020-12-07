import { DataEvent } from "app/controllers/DataEvent";
import { Mediator } from "app/framework/Mediator";
import { GameEvents, isMobile } from "app/models/AppData";

export class GUIViewMediator extends Mediator {

    private _GUI: HTMLElement;

    private homeURL: string;

    constructor(dispatcher: EventTarget, home: string) {
        super(dispatcher);
        this.homeURL = home;
        this._GUI = document.getElementById('app');
    }


    public hideLoading(): void {
        let loadingTextField: HTMLParagraphElement = document.getElementById("loadingTextfield") as HTMLParagraphElement;
        loadingTextField.style.display = "none";
        let button: HTMLButtonElement = document.getElementById("homeButton") as HTMLButtonElement;
        button.style.display = "";
        document.getElementById("danceButton").style.display = "none";

        this.orientationCheck();

    }

    public displayDanceButton(value: boolean): void {
        document.getElementById("textTest").style.display = "none";
        document.getElementById("danceButton").style.display = value ? "" : "none";
    }

    public displayDirections(value: boolean): void {
        document.getElementById("textTest").style.display = value ? "" : "none";
        document.getElementById("danceButton").style.display = "none";
    }

    public orientationCheck(): void {

        if (!isMobile()) {
            document.getElementById("infoText").style.display = "none";
        }
        else {
            if (window.innerHeight > window.innerWidth) {
                console.log("in portrait mode");
                document.getElementById("infoText").style.display = "";
            }
            else {
                console.log("in landscape mode");
                document.getElementById("infoText").style.display = "none";
            }
        }
    }

    public initialize(): void {


        let button: HTMLButtonElement = document.getElementById("homeButton") as HTMLButtonElement;
        let danceButton: HTMLButtonElement = document.getElementById("danceButton") as HTMLButtonElement;
        let textField: HTMLParagraphElement = document.getElementById("textTest") as HTMLParagraphElement;

        textField.textContent = "Point the camera at the Science of Pixar AR card";

        button.style.display = "none";
        button.addEventListener("click", (eve) => {
            eve.preventDefault();

            // history.back();

            location.href = this.homeURL;
        })

        danceButton.style.display = "none";
        danceButton.addEventListener("click", (eve) => {
            eve.preventDefault();
            this.contextDispatcher.dispatchEvent(new Event(GameEvents.DANCE))
        })

        this.contextDispatcher.addEventListener(GameEvents.DISPLAY_DANCE_BUTTON, (eve: DataEvent) => {
            this.displayDanceButton(eve.data);
        })

        this.contextDispatcher.addEventListener(GameEvents.DISPLAY_INFO_BUTTON, (eve: DataEvent) => {
            this.displayDirections(eve.data);
        })

        textField.style.display = "none";


        window.addEventListener("orientationchange", (event) => {
            console.log("the orientation of the device is now ");

            this.orientationCheck();
        });
    }
}