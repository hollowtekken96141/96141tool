export class Exporter {
    constructor(sceneEditor) {
        this.sceneEditor = sceneEditor;
    }

    exportData() {
        const dataStr = JSON.stringify(this.sceneEditor.scenes);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'scenes.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    importData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedScenes = JSON.parse(e.target.result);
                this.sceneEditor.scenes = importedScenes;
                this.sceneEditor.updateSceneSelector();
                this.sceneEditor.selectScene(Object.keys(this.sceneEditor.scenes)[0]);
            };
            reader.readAsText(file);
        }
    }
}
