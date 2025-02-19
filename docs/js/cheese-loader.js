class CheeseTextureLoader {
    constructor() {
        this.loader = new THREE.SVGLoader();
        this.textures = new Map();
    }

    async loadTexture(name) {
        try {
            if (this.textures.has(name)) {
                return this.textures.get(name);
            }

            const svgData = await this.loader.loadAsync(`../assets/images/cheese/${name}.svg`);
            const texture = new THREE.CanvasTexture(this.svgToCanvas(svgData));
            this.textures.set(name, texture);
            return texture;
        } catch (error) {
            console.warn(`Failed to load texture ${name}, using fallback`, error);
            return null;
    }

    svgToCanvas(svgData) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Failed to get 2D context');
            }
            
            svgData.paths.forEach((path) => {
                const shapes = path.toShapes(true);
                shapes.forEach((shape) => {
                    ctx.fillStyle = path.color;
                    ctx.fill(new Path2D(shape.toString()));
                });
            });
            
            return canvas;
        } catch (error) {
            console.warn('Failed to create texture canvas, using fallback', error);
            return null;
    }
}
