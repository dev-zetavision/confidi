// This file is responsible for loading 3D models into the scene, managing their visibility and interactions.

const loadModel = (url, onLoad) => {
    const loader = new THREE.GLTFLoader();
    loader.load(url, (gltf) => {
        onLoad(gltf);
    }, undefined, (error) => {
        console.error('An error occurred while loading the model:', error);
    });
};

const addModelToScene = (scene, model) => {
    scene.add(model.scene);
};

const removeModelFromScene = (scene, model) => {
    scene.remove(model.scene);
};

const loadModels = (scene) => {
    const models = [];

    loadModel('assets/models/model1.glb', (gltf) => {
        addModelToScene(scene, gltf);
        models.push(gltf);
    });

    loadModel('assets/models/model2.glb', (gltf) => {
        addModelToScene(scene, gltf);
        models.push(gltf);
    });

    // Add more models as needed

    return models;
};

export { loadModels, addModelToScene, removeModelFromScene };