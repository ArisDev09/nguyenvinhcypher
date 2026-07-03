document.addEventListener('DOMContentLoaded', function() {
    // Video: force loop & play
    const video = document.getElementById('bgVideo');
    if (video) {
        video.muted = true;
        video.loop = true;
        video.preload = 'auto';
        video.play().catch(() => {});
    }

    // Reveal on scroll
    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealItems.forEach(item => scrollObserver.observe(item));

    // Holosec image
    const holosecImage = document.getElementById('holosecImage');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) holosecImage.classList.add('visible');
        });
    }, { threshold: 0.2 });
    observer.observe(holosecImage);

    // Parallax
    const parallaxBg = document.getElementById('parallaxBg');
    const wrapper = document.getElementById('universeWrapper');

    function updateParallax() {
        if (!wrapper || !parallaxBg) return;
        const rect = wrapper.getBoundingClientRect();
        const scrollY = window.scrollY;
        const wrapperTop = rect.top + scrollY;
        const visibleProgress = Math.min(1, Math.max(0, (scrollY - wrapperTop + window.innerHeight) / (rect
            .height + window.innerHeight)));
        parallaxBg.style.transform = 'translateY(' + (visibleProgress * 25) + '%)';
    }
    window.addEventListener('scroll', updateParallax);

    // ===== THREE.JS GLOBE =====
    const container = document.getElementById('globeContainer');
    const canvas = document.getElementById('globeCanvas');

    if (container && canvas) {
        let width = canvas.clientWidth || 900;
        let height = canvas.clientHeight || 500;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020208, 0.001);

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
        camera.position.set(0, 50, 240);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI / 2;
        controls.maxPolarAngle = Math.PI / 2;

        let autoRotate = true;
        let lastInteraction = Date.now();

        renderer.domElement.addEventListener('mousedown', () => {
            autoRotate = false;
            lastInteraction = Date.now();
        });
        renderer.domElement.addEventListener('mousemove', () => {
            lastInteraction = Date.now();
        });
        renderer.domElement.addEventListener('mouseup', () => {
            lastInteraction = Date.now();
        });
        renderer.domElement.addEventListener('touchstart', () => {
            autoRotate = false;
            lastInteraction = Date.now();
        });
        renderer.domElement.addEventListener('touchmove', () => {
            lastInteraction = Date.now();
        });
        renderer.domElement.addEventListener('touchend', () => {
            lastInteraction = Date.now();
        });

        const earthRadius = 95;
        const earthGroup = new THREE.Group();
        scene.add(earthGroup);

        const liveStreams = [];

        function latLonToVector3(lat, lon, radius) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (-lon + 180) * (Math.PI / 180);
            return new THREE.Vector3(
                -(radius * Math.sin(phi) * Math.sin(theta)),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.cos(theta)
            );
        }

        const coreGeo = new THREE.SphereGeometry(earthRadius - 0.4, 32, 32);
        const coreMesh = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({
            color: 0x03030a,
            transparent: true,
            opacity: 0.95
        }));
        earthGroup.add(coreMesh);

        const blueMapMaterial = new THREE.LineBasicMaterial({
            color: 0x0077ff,
            transparent: true,
            opacity: 0.65
        });

        function drawCoordinatesBranch(coords, material) {
            const points = [];
            coords.forEach(coord => {
                if (coord[0] !== undefined && coord[1] !== undefined) {
                    points.push(latLonToVector3(coord[1], coord[0], earthRadius));
                }
            });
            if (points.length < 2) return;
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            earthGroup.add(new THREE.Line(geometry, material));
        }

        function parseGeoJSONAndDraw(geoData, material) {
            if (!geoData || !geoData.features) return;
            geoData.features.forEach(feature => {
                if (!feature.geometry) return;
                var type = feature.geometry.type;
                var coordinates = feature.geometry.coordinates;
                if (type === "Polygon") {
                    drawCoordinatesBranch(coordinates[0], material);
                } else if (type === "MultiPolygon") {
                    coordinates.forEach(function(p) { drawCoordinatesBranch(p[0], material); });
                }
            });
        }

        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            .then(function(res) { return res.json(); })
            .then(function(data) { parseGeoJSONAndDraw(data, blueMapMaterial); })
            .catch(function() {});

        var locations = [
            { lat: 21.0285, lon: 105.8542 },
            { lat: 10.8231, lon: 106.6297 },
            { lat: 40.7128, lon: -74.0060 },
            { lat: 51.5074, lon: -0.1278 },
            { lat: 35.6762, lon: 139.6503 },
            { lat: 1.3521, lon: 103.8198 },
            { lat: -33.8688, lon: 151.2093 },
            { lat: 55.7558, lon: 37.6173 }
        ];

        function createDdosStream() {
            var fromIdx = Math.floor(Math.random() * locations.length);
            var toIdx = Math.floor(Math.random() * locations.length);
            while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * locations.length);

            var p1 = latLonToVector3(locations[fromIdx].lat, locations[fromIdx].lon, earthRadius);
            var p2 = latLonToVector3(locations[toIdx].lat, locations[toIdx].lon, earthRadius);
            var dist = p1.distanceTo(p2);

            var curvePoints = [];
            for (var k = 0; k <= 45; k++) {
                var t = k / 45;
                var p = new THREE.Vector3().lerpVectors(p1, p2, t);
                p.normalize().multiplyScalar(earthRadius + 1 + (dist * 0.18) * Math.sin(t * Math.PI));
                curvePoints.push(p);
            }

            var curve = new THREE.CatmullRomCurve3(curvePoints);
            var trailLength = 7;
            var streamGeo = new THREE.BufferGeometry();
            streamGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(trailLength * 3), 3));

            var streamParticles = new THREE.Points(streamGeo, new THREE.PointsMaterial({
                color: 0x00d2ff,
                size: 1.8,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending
            }));
            earthGroup.add(streamParticles);

            liveStreams.push({
                curve: curve,
                progress: 0,
                speed: 0.014 + Math.random() * 0.018,
                particles: streamParticles,
                trailLength: trailLength
            });
        }

        var clock = new THREE.Clock();

        function animateGlobe() {
            requestAnimationFrame(animateGlobe);

            if (Date.now() - lastInteraction > 3000) {
                autoRotate = true;
            }

            if (autoRotate) {
                earthGroup.rotation.y += 0.002;
            } else {
                controls.update();
            }

            if (liveStreams.length < 50 && Math.random() > 0.3) {
                createDdosStream();
            }

            for (var i = liveStreams.length - 1; i >= 0; i--) {
                var stream = liveStreams[i];
                stream.progress += stream.speed;
                if (stream.progress >= 1) {
                    earthGroup.remove(stream.particles);
                    liveStreams.splice(i, 1);
                } else {
                    var positions = stream.particles.geometry.attributes.position.array;
                    for (var j = 0; j < stream.trailLength; j++) {
                        var t = Math.max(0, stream.progress - (j * 0.014));
                        var point = stream.curve.getPointAt(t);
                        positions[j * 3] = point.x;
                        positions[j * 3 + 1] = point.y;
                        positions[j * 3 + 2] = point.z;
                    }
                    stream.particles.geometry.attributes.position.needsUpdate = true;
                }
            }

            renderer.render(scene, camera);
        }
        animateGlobe();

        function resizeCanvas() {
            const w = canvas.clientWidth || 900;
            const h = canvas.clientHeight || 500;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => resizeCanvas());
            ro.observe(container);
        }
    }
});