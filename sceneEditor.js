import { updateSceneSelector, clearClickableAreas, createClickableArea } from './utils.js';

export class SceneEditor {
    constructor() {
        this.scenes = JSON.parse(localStorage.getItem('scenes')) || { "1": { gif: '', areas: [] } };
        this.currentScene = "1";
        this.sceneSelector = document.getElementById('scene-selector');
        this.editor = document.getElementById('editor');
    }

    initializeScenes() {
        if (!this.scenes || Object.keys(this.scenes).length === 0) {
            this.scenes = { "1": { gif: '', areas: [] } };
        }
        updateSceneSelector();
        this.selectScene("1");
    }

    addScene(name) {
        if (name && !this.scenes[name]) {
            this.scenes[name] = { gif: '', areas: [] };
            updateSceneSelector();
            this.selectScene(name);
        } else {
            alert("Scene name already exists or is invalid.");
        }
    }

    deleteScene() {
        if (this.currentScene) {
            delete this.scenes[this.currentScene];
            updateSceneSelector();
            this.selectScene(Object.keys(this.scenes)[0]);
        }
    }

    renameScene(newName) {
        if (this.currentScene && newName && !this.scenes[newName]) {
            this.scenes[newName] = this.scenes[this.currentScene];
            delete this.scenes[this.currentScene];
            updateSceneSelector();
            this.selectScene(newName);
        } else {
            alert("Scene name already exists or is invalid.");
        }
    }

    uploadGif(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (this.currentScene) {
                    const gifData = e.target.result;
                    this.scenes[this.currentScene].gif = gifData;
                    this.displayScene(this.currentScene);
                    localStorage.setItem('scenes', JSON.stringify(this.scenes));
                }
            };
            reader.readAsDataURL(file);
        }
    }

    displayScene(sceneName) {
        const scene = this.scenes[sceneName];
        clearClickableAreas();
        if (scene) {
            const gifData = scene.gif;
            if (gifData) {
                const img = new Image();
                img.onload = () => {
                    this.editor.style.backgroundImage = `url('${gifData}')`;
                    this.editor.style.backgroundSize = 'cover';
                    this.editor.style.backgroundPosition = 'center';
                };
                img.src = gifData;
            } else {
                this.editor.style.backgroundImage = 'none';
            }
            if (scene.areas && Array.isArray(scene.areas)) {
                scene.areas.forEach(areaData => {
                    const area = createClickableArea(areaData);
                    this.editor.appendChild(area);
                });
            }
        }
    }

    selectScene(sceneName) {
        if (this.currentScene && this.scenes[this.currentScene]) {
            this.saveSceneAreas();
        }
        this.currentScene = sceneName;
        this.sceneSelector.value = sceneName;
        this.loadAreasForScene(sceneName);
        this.displayScene(sceneName);
    }

    saveSceneAreas() {
        if (!this.currentScene || !this.scenes[this.currentScene]) return;

        const areas = Array.from(this.editor.querySelectorAll('.clickable-area')).map(area => ({
            scene_id: this.currentScene,
            top: area.style.top || '0%',
            left: area.style.left || '0%',
            width: area.style.width || '20%',
            height: area.style.height || '20%',
            target: area.dataset.target || '',
            new_tab: area.dataset.newTab === 'true',
            transition_gif: area.dataset.transitionGif || '',
            transition_duration: area.dataset.transitionDuration || 0,
            target_type: area.dataset.targetType || 'state'
        }));

        this.scenes[this.currentScene].areas = areas;
        localStorage.setItem('scenes', JSON.stringify(this.scenes));
    }

    loadAreasForScene(sceneName) {
        const scene = this.scenes[sceneName];
        if (scene) {
            this.displayScene(sceneName);
        }
    }
}
