export class EventListeners {
    constructor(sceneEditor, areaEditor) {
        this.sceneEditor = sceneEditor;
        this.areaEditor = areaEditor;
    }

    initializeEventListeners() {
        document.getElementById('add-scene-button').addEventListener('click', () => {
            const sceneName = prompt("Enter new scene name:");
            this.sceneEditor.addScene(sceneName);
        });

        document.getElementById('delete-scene-button').addEventListener('click', () => {
            this.sceneEditor.deleteScene();
        });

        document.getElementById('rename-scene-button').addEventListener('click', () => {
            const newName = prompt("Enter new scene name:", this.sceneEditor.currentScene);
            this.sceneEditor.renameScene(newName);
        });

        document.getElementById('add-clickable-area').addEventListener('click', () => {
            this.areaEditor.addClickableArea();
        });

        document.getElementById('upload-gif').addEventListener('change', (event) => {
            this.sceneEditor.uploadGif(event);
        });

        document.getElementById('clear-storage-button').addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
    }
}
