Config = {
    ANGLE: 45,
    ASPECT: 2.1075740944017562,
    BASE_PARTICLE_SIZE: 12,
    CAMERA_Z: 1400,
    CANVAS_PARTICLES: 2500,
    CANVAS_PARTICLES_TOUCH: 1400,
    FAR: 3000,
    FIELD_OF_VIEW: 60,
    FOG_DENSITY: 0.0004,
    FOG_HEX: 0,
    HALF_HEIGHT: 455.5,
    HALF_WIDTH: 960,
    HEIGHT: 911,
    IMAGE_DATAS: {},
    IMAGE_SCALE: 2,
    MAX_DISTANCE: 1000,
    MOBILE_PARTICLE_SIZE: 18,
    NEAR: 1,
    PARTICLES: 5500,
    PARTICLES_TOUCH: 2500,
    PARTICLE_COLOR: 6052956,
    WIDTH: 1920
};
CONFIG = Config;

ParticleManager = function (shapes, container, isCanvas) {
    this.images = [];
    this.isCanvas = isCanvas || false;
    this.container = container ? container : $('#particles');



    if(shapes) {
        for (var i = 0; i < shapes.length; i++) {
            this.images[i] = new Image();
            this.images[i].src = shapes[i];
        }

        imagesLoaded(this.images,this.onImagesLoaded.bind(this,true));
    } else {
        this.onImagesLoaded(false);
    }

};
ParticleManager.prototype.CreateFlow = function () {
    var self = this;

    setInterval(function () {
        flow.ambientSequence(self.positions);
    }, 1500);
};

ParticleManager.prototype.onMouseMove = function (event) {
    this.mouseX = event.clientX - (window.innerWidth / 2);
    this.mouseY = event.clientY - (window.innerHeight / 2);
};

ParticleManager.prototype.onImagesLoaded = function(hasShapes) {
    this.coordinates = hasShapes ? imageData(this.images) : null; // creates an array of coordinates of the shapes if there are shapes
    //app.channel('homepage').trigger('particles:loaded');
    if(this.isCanvas) {
        this.setupCanvas();
    } else {
        this.setup(this.coordinates);
    }
};

ParticleManager.prototype.onResize = function(event) {
    Config = CONFIG();
    // To accomidate the difference in height with the fixed nav bar
    var height = Config.WIDTH < 768 ? Config.HEIGHT - 59 : Config.HEIGHT;

    if(!this.isCanvas) {
        this.camera.aspect = Config.WIDTH / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(Config.WIDTH, height);
    } else {
        this.canvas.width = Config.WIDTH;
        this.canvas.height = height;

    }


};

ParticleManager.prototype.setup = function(shapes) {

    this.oddTick = false;

    //this.container = document.createElement( 'div' );
    this.materials = [];
    this.positions = [];

    this.mouseX = 0;
    this.mouseY = 0;

    //document.body.appendChild( this.container );

    //this.stats();

    this.total = Config.PARTICLES;

    this.camera = new THREE.PerspectiveCamera(Config.ANGLE, Config.ASPECT, Config.NEAR, Config.FAR );
    this.camera.position.z = 1400;


    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );

    this.geometry = new THREE.Geometry();

    var sprite = THREE.ImageUtils.loadTexture( "Images/particle-4.png" );

    for ( i = 0; i < this.total; i ++ ) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Config.HEIGHT;
        vertex.z = Math.random() * 2000 - 1000;

        this.geometry.vertices.push( vertex );
        this.positions.push(new ParticleAnimator(vertex.x, vertex.y, vertex.z));

    }

    var material = new THREE.PointCloudMaterial( { size: Config.BASE_PARTICLE_SIZE, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } ),
        particles = new THREE.PointCloud( this.geometry, material );
    this.scene.add( particles );



    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //this.container.appendChild( this.renderer.domElement );

    $('#particles').append(this.renderer.domElement);

    document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );

    if(!shapes) {
        console.log('ambientSequence');
        this.CreateFlow();

    } else {
        flow.imageSequence(this.positions, this.coordinates);
    }

    //app.channel('browser').on('resize', this.onResize, this);
    this.animate();

};

ParticleManager.prototype.stats = function() {
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild( this.stats.domElement );
};

ParticleManager.prototype.animate = function() {

    if(this.alive !== false) {
        requestAnimationFrame(this.animate.bind(this));

        this.render();
    }
};

ParticleManager.prototype.onMouseMove = function(event) {
    this.mouseX = event.clientX - (window.innerWidth / 2);
    this.mouseY = event.clientY - (window.innerHeight / 2);
};

ParticleManager.prototype.destroy = function() {
    this.alive = false; // stop the request animation frame..
    //app.channel('browser').off('mousemove', this.onMouseMove, this);
    ////app.channel('browser').off('touchstart', this.onTouchStart, this);
    ////app.channel('browser').off('touchmove', this.onTouchMove, this);
    //app.channel('browser').off('resize', this.onResize, this);
};

ParticleManager.prototype.render = function() {
    this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 0.05;
    this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 0.05;

    this.camera.lookAt( this.scene.position );

    var start = this.oddTick === false ? 0 : this.geometry.vertices.length/2;
    var end = this.oddTick === false ? this.geometry.vertices.length/2 : this.geometry.vertices.length;

    for ( i = 0; i < this.geometry.vertices.length; i ++ ) {

        var object = this.geometry.vertices[ i ],
            mover = this.positions[ i ];

        object.y = mover.animateY();
        object.x = mover.animateX();
        object.z = mover.animateZ();


    }

    this.oddTick = this.oddTick === false ? true : false;

    this.geometry.verticesNeedUpdate = true;

    this.renderer.render(this.scene, this.camera);
};


ParticleManager.prototype.animateCanvas = function() {
    if(this.alive !== false) {
        requestAnimationFrame(this.animateCanvas.bind(this));
        this.renderCanvas();
    }
};

ParticleManager.prototype.renderCanvas = function() {

    var count = this.total;
    var context = this.canvas.getContext( '2d' );

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for ( i = 0; i < this.positions.length; i ++ ) {

        var mover = this.positions[ i ];

        mover.animateX();
        mover.animateY();
        mover.animateZ();

        this.canvasDrawParticle(context, mover);


    }

};

ParticleManager.prototype.canvasDrawParticle = function(context, mover) {
    var particleSize = 10,
        pX = mover.x.c,
        pY = Config.HEIGHT - mover.y.c,
        pZ = mover.z.c,

        x = (pX + Config.HALF_WIDTH),
        y = (pY - Config.HALF_HEIGHT),
    //y = pY,
        pZ = mover.z.c/80,
        z = pZ < 2 ? 2 : pZ,
        rX = x,//this.roundIt(x, 1),
        rY = y, //this.roundIt(y, 1),
        rZ = z, //this.roundIt(z, 1),
        gA = rZ/10;

    if(gA > .90) {
        gA = .90;
    }


    if(rZ < 10) {
        context.globalAlpha = gA;
        context.drawImage(this.particleImg, 0, 0, 16, 16, rX, rY, rZ, rZ);
    } else {
        context.globalAlpha = gA;
        context.drawImage(this.particleImg, 0, 0, 16, 16, rX, rY, rZ, rZ);
    }
};

ParticleManager.prototype.setupCanvas = function() {

    this.oddTick = false;

    this.isCanvas = true;
    this.total = Config.CANVAS_PARTICLES;
    this.oddCycle = true;

    this.positions = [];

    var particle,
        i;

    for (i = 0; i < this.total; i++) {

        var vertex = {};
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Config.HEIGHT;
        vertex.z = Math.random() * 2000 - 1000;

        particle = new ParticleAnimator(vertex.x, vertex.y, vertex.z);
        this.positions.push(particle);
    }

    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = Config.WIDTH;
    this.canvas.height = Config.HEIGHT;
    this.particleImg = document.getElementById("particle-image");
    //this.particleImg70 = document.getElementById("particle-image-70");

    $('#particles').append(this.canvas);

    if(this.coordinates) {
        flow.imageSequence(this.positions, this.coordinates, true);
    } else {
        flow.ambientSequence(this.positions, true);
    }

    this.animateCanvas();

    //app.channel('browser').on('resize', this.onResize, this);

};

var shapes = [
    '/img/Dark_Confidant_DGM_iPad_Wallpaper.jpg',
    '/img/of_the_many_by_jamesarnold-da2sm9u.jpg',
    '/img/twilight__the_mind_sculptor_by_jin1515-d5p3ccv.jpg',
    '/img/ulamog__the_ceaseless_hunger_by_william9929-d9hy0ei.jpg',
    '/img/ob_nixilis_by_8nina8-d9mnlc6.jpg'
];
var manager = new ParticleManager();


//manager.init();
//manager.init_alt();


var container, stats;
var camera, scene, renderer, particle;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var oddTick = false;

//init();
//animate();

function init() {

    this.positions = [];
    this.total = 2000;

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1400;

    geometry = new THREE.Geometry();
    scene = new THREE.Scene();

    var material = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(generateSprite()),
        blending: THREE.AdditiveBlending,
        color: '0xffffff'
    });

    for (var i = 0; i < this.total; i++) {

        particle = new THREE.Sprite(material);

        initParticle(particle, i * 10);

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Config.HEIGHT;
        vertex.z = Math.random() * 2000 - 1000;

        this.geometry.vertices.push(vertex);
        this.positions.push(new ParticleAnimator(vertex.x, vertex.y, vertex.z));

        scene.add(particle);
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);


    flow.ambientSequence(this.positions);

    //if(this.alive !== false) {
    requestAnimationFrame(this.animate.bind(this));

    this.render_alt();
    //}

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.1, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.9, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;

}

function initParticle(particle, delay) {

    var particle = this instanceof THREE.Sprite ? this : particle;
    var delay = delay !== undefined ? delay : 0;

    particle.position.x = Math.random() * 2000 - 1000;
    particle.position.y = Math.random() * 2000 - 1000;
    particle.position.z = Math.random() * 2000 - 1000;
    particle.scale.x = particle.scale.y = Math.random() * 10 + 10;
    particle.scale.x = particle.scale.y = Math.random() * 32 + 16;

    new TWEEN.Tween(particle)
        .delay(delay)
        .to({}, 10000)
        .onComplete(initParticle)
        .start();

    new TWEEN.Tween(particle.position)
        .delay(delay)
        .to({
            x: Math.random() * 4000 - 2000,
            y: Math.random() * 1000 - 500,
            z: Math.random() * 4000 - 2000
        }, 10000)
        .start();

    new TWEEN.Tween(particle.scale)
        .delay(delay)
        .to({x: 0.01, y: 0.01}, 10000)
        .start();

}

//

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

//

function animate() {

    requestAnimationFrame(animate.bind(this));

    render_alt();
    stats.update();

}

function render() {

    TWEEN.update();

    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( -mouseY - camera.position.y ) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}

function render_alt() {
    TWEEN.update();

    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( -mouseY - camera.position.y ) * 0.05;

    camera.lookAt(scene.position);

    var start = oddTick === false ? 0 : this.geometry.vertices.length / 2;
    var end = oddTick === false ? this.geometry.vertices.length / 2 : this.geometry.vertices.length;

    for (i = 0; i < this.geometry.vertices.length; i++) {

        var object = this.geometry.vertices[i],
            mover = this.positions[i];

        object.y = mover.animateY();
        object.x = mover.animateX();
        object.z = mover.animateZ();


    }

    oddTick = oddTick === false ? true : false;

    geometry.verticesNeedUpdate = true;

    renderer.render(scene, camera);
}