import { initResize, initDrag } from './utils.js';

export class AreaEditor {
    constructor(sceneEditor) {
        this.sceneEditor = sceneEditor;
        this.editor = document.getElementById('editor');
        this.areaForm = document.querySelector('.area-form');
        this.targetType = document.getElementById('target-type');
        this.targetState = document.getElementById('target-state');
        this.targetLink = document.getElementById('target-link');
        this.newTabCheckbox = document.getElementById('new-tab');
        this.transitionGifInput = document.getElementById('transition-gif');
    }

    initializeAreas() {
        this.loadAreasForScene(this.sceneEditor.currentScene);
    }

    saveSceneAreas() {
        this.sceneEditor.saveSceneAreas();
    }

    addClickableArea() {
        if (!this.sceneEditor.currentScene) {
            alert('Please select a scene first');
            return;
        }

        const area = document.createElement('div');
        area.classList.add('clickable-area');
        area.style.top = '10%';
        area.style.left = '10%';
        area.style.width = '20%';
        area.style.height = '20%';
        area.dataset.target = '';
        area.dataset.newTab = false;
        area.dataset.targetType = 'state';

        area.addEventListener('mousedown', initDrag);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => {
            this.editArea(area);
        });
        area.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => area.remove());
        area.appendChild(deleteButton);

        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle');
        resizeHandle.addEventListener('mousedown', initResize);
        area.appendChild(resizeHandle);

        this.editor.appendChild(area);
    }

    loadAreasForScene(sceneName) {
        const scene = this.sceneEditor.scenes[sceneName];
        if (scene) {
            this.sceneEditor.displayScene(sceneName);
        }
    }

    editArea(area) {
        this.areaForm.style.display = 'block';
        this.targetType.value = area.dataset.targetType || 'state';
        this.targetState.value = this.targetType.value === 'state' ? area.dataset.target : '';
        this.targetLink.value = this.targetType.value === 'external' ? area.dataset.target : '';
        this.newTabCheckbox.checked = area.dataset.newTab === 'true';
        this.transitionGifInput.value = '';

        const transitionGifText = document.getElementById('transition-gif-text');
        if (transitionGifText) {
            transitionGifText.textContent = area.dataset.transitionGif ? 'Current GIF: ' + area.dataset.transitionGif : 'No GIF set';
        }
    }
}
