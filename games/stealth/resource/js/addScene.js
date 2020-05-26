function reflectX(id) {
  objects[id].sceneObj.position.x = -objects[id].sceneObj.position.x;
  objects[id].sceneObj.rotation.z = -objects[id].sceneObj.rotation.z;
}
function reflectY(id) {
  objects[id].sceneObj.position.y = -objects[id].sceneObj.position.y;
  objects[id].sceneObj.rotation.z = -objects[id].sceneObj.rotation.z+Math.PI;
}
function transXY(id) {
  var tmp = objects[id].sceneObj.position.x;
  objects[id].sceneObj.position.x = objects[id].sceneObj.position.y;
  objects[id].sceneObj.position.y = tmp;
  // if (objects[id].tag.substr(0, 4) == "wall") {
  //   if (objects[id].size.w > objects[id].size.h) {
  //     objects[id].sceneObj.rotation.z += -Math.PI/2;
  //   } else if (objects[id].size.w < objects[id].size.h) {
  //     objects[id].sceneObj.rotation.z += Math.PI/2;
  //   }
  // } else {
  //   if (objects[id].sceneObj.rotation.z == 0 || objects[id].sceneObj.rotation.z == Math.PI) {
  //     objects[id].sceneObj.rotation.z += -Math.PI/2;
  //   } else if (objects[id].sceneObj.rotation.z == Math.PI/2) {
  //     objects[id].sceneObj.rotation.z += Math.PI/2;
  //   } else {
  //     objects[id].sceneObj.rotation.z += Math.PI/2;
  //   }
  // }
  if (objects[id].sceneObj.rotation.z == 0 || objects[id].sceneObj.rotation.z == Math.PI) {
    objects[id].sceneObj.rotation.z += -Math.PI/2;
  } else {
    objects[id].sceneObj.rotation.z += Math.PI/2;
  }
  if (objects[id].ghostMode == "2") {
    var tmp = objects[id].size.w;
    objects[id].size.w = objects[id].size.h;
    objects[id].size.h = tmp;
  }
}
function setPlaceLayout(id) {
    switch (layoutRoom) {
      case 2:
        reflectY(id);
        break;
      case 3:
        transXY(id);
        break;
      case 4:
        transXY(id);
        reflectY(id);
        break;
      case 5:
        reflectX(id);
        break;
      case 6:
        reflectX(id);
        reflectY(id);
        break;
      case 7:
        transXY(id);
        reflectX(id);
        break;
      case 8:
        transXY(id);
        reflectX(id);
        reflectY(id);
        break;
    }
}
function addScene(obj) {
  var worldSize = {w: 200, h: 200};
  var wallDepth = 1;
  var deltaBug = 0.1;
  switch (obj.tag) {
    case 'blood':
      var bloodGeometry = new THREE.CircleBufferGeometry(3, 16);
      var bloodMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000, side: THREE.DoubleSide});
      var bloodObject = new THREE.Mesh(bloodGeometry, bloodMaterial);
      bloodObject.position.set(objects[obj.id].coord.x, objects[obj.id].coord.y, 0.1);
      objects[obj.id].stopBullet = false;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = bloodObject;
      scene.add(bloodObject);
      break;
    case 'bullet':
      var bulletGeometry = new THREE.BoxGeometry(1, 1, 1);
      var bulletMaterial = [
        new THREE.MeshPhongMaterial({color: 0xFCF403, side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({color: 0xFCF403, side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({color: 0xFCF403, side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({color: 0xFCF403, side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({color: 0xFCF403, side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({color: 0xFCF403, side: THREE.DoubleSide})
      ];
      var bulletObject = new THREE.Mesh(bulletGeometry, bulletMaterial);
      bulletObject.scale.set(0.1, 5, 0.1);
      bulletObject.position.set(objects[obj.id].coord.x, objects[obj.id].coord.y, 5);
      bulletObject.rotation.z = Math.atan(objects[obj.id].speed.y/objects[obj.id].speed.x)+Math.PI/2;
      objects[obj.id].stopBullet = false;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = bulletObject;
      scene.add(bulletObject);
      break;
    case 'player':
      if (!loadObjects.human || !loadTextures.human || !loadTextures.eye || !loadTextures.eye001 || !loadTextures.knife) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.human.scene.clone();
        var currTexture1 = loadTextures.human.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.eye.clone();
        currTexture2.needsUpdate = true;
        var currTexture3 = loadTextures.eye001.clone();
        currTexture3.needsUpdate = true;
        var currTexture4 = loadTextures.knife.clone();
        currTexture4.needsUpdate = true;

        var loader = new THREE.GLTFLoader();
        loader.load('/g/stealth/resource/models/human.glb', function(gltf) {
          gltf.scene.position.set(obj.coord.x, obj.coord.y, 0);
          gltf.scene.rotation.x = Math.PI/2;

          gltf.scene.traverse(function (child) {
          // currScene.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              if (child.name == "Sphere") {
                child.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, skinning: true, map: currTexture2});
              } else if (child.name == "Sphere001") {
                child.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, skinning: true, map: currTexture3});
              } else if (child.name == "Gun") {
                child.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, skinning: true, color: 0x000000});
              } else if (child.name == "knife") {
                child.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, skinning: true, map: currTexture4});
              } else {
                child.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, skinning: true, map: currTexture1});
              }
            }
          });

          // var currAnimations = [];
          // for (var i = 0; i < loadObjects.human.animations.length; i++) {
          //   currAnimations[i] = loadObjects.human.animations[i].clone();
          // }
          var mixer = new THREE.AnimationMixer(gltf.scene);
          objects[obj.id].animations = gltf.animations;
          objects[obj.id].sceneObj = gltf.scene;
          // var mixer = new THREE.AnimationMixer(currScene);
          // objects[obj.id].animations = currAnimations;
          // objects[obj.id].sceneObj = currScene;
          // objects[obj.id].scenes[0] = currScene;
          // objects[obj.id].scene = currScene;

          objects[obj.id].mixer = mixer;
          objects[obj.id].activeWeapon = 1;
          objects[obj.id].stopBullet = true;
          objects[obj.id].size = {w: 2, h: 2, d: 5};
          objects[obj.id].health = 100;
          objects[obj.id].bleeding = 0;
          objects[obj.id].bullets = 7;
          objects[obj.id].aiming = false;
          objects[obj.id].dead = false;
          objects[obj.id].spectating = false;
          objects[obj.id].killing = [];
          visibleObj(objects[obj.id], "KnifeObj", false);
          objects[obj.id].visibleThrough = true;
          scene.add(gltf.scene);
          // scene.add(currScene);
          new THREE.FontLoader().load('/g/stealth/resource/fonts/helvetiker.json', function (font) {
            var nameGeometry = new THREE.TextGeometry(objects[obj.id].name, {
              font: font,
          		size: 0.3,
          		height: 0,
          		curveSegments: 10,
          		bevelEnabled: false,
          		bevelThickness: 8,
          		bevelSize: 6,
          		bevelOffset: 0,
          		bevelSegments: 3
          	});
            var nameMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.4 });
            var nameObject = new THREE.Mesh(nameGeometry, nameMaterial);
            nameObject.position.set(objects[obj.id].coord.x, objects[obj.id].coord.y, 7);
            objects[obj.id].nameObj = nameObject;
            nameGeometry.computeBoundingSphere()
            //setTimeout(function() {
              objects[obj.id].shiftName = nameObject.geometry.boundingSphere.center.x;
            //}, 3000);
            scene.add(nameObject);
          }, undefined, function ( err ) { console.err(err); });

        }, undefined, function(err) {
          console.error(err);
        });
      }
      break;
    case 'circle':
      var circleGeometry = new THREE.CircleBufferGeometry(10, 32);
      var circleMaterial = new THREE.MeshPhongMaterial({color: 0x0000FF, transparent: true, opacity: 0.1, side: THREE.DoubleSide});
      var circleObject = new THREE.Mesh(circleGeometry, circleMaterial);
      circleObject.position.set(objects[obj.id].coord.x, objects[obj.id].coord.y, 5);
      circleObject.visible = false;
      objects[obj.id].stopBullet = false;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = circleObject;
      scene.add(circleObject);
      break;
    case 'floorHall':
      if (!loadTextures.floorHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.floorHall.clone();
        currTexture.needsUpdate = true;
        var floorGeometry = new THREE.PlaneGeometry(worldSize.w, worldSize.h, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
        var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
        floorObject.position.set(0, 0, -0.1);
        currTexture.repeat.set(30, 30);
        floorObject.receiveShadow = true;
        floorObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].sceneObj = floorObject;
        scene.add(floorObject);
      }
      break;
    case 'floorRestaurant':
      if (!loadTextures.floorRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.floorRestaurant.clone();
        currTexture.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
        var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
        floorObject.scale.set(w, h, 1);
        floorObject.position.set(-worldSize.w/2+w/2, -worldSize.h/2+h/2, 0);
        currTexture.repeat.set(4, 16);
        floorObject.receiveShadow = true;
        floorObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].sceneObj = floorObject;
        setPlaceLayout(obj.id);
        scene.add(floorObject);
      }
      break;
    case 'floorKitchen':
      if (!loadTextures.floorKitchen) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.floorKitchen.clone();
        currTexture.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
        var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
        floorObject.scale.set(w, h, 1);
        floorObject.position.set(-worldSize.w/2+w/2, worldSize.h/2-h/2, 0);
        currTexture.repeat.set(4, 4);
        floorObject.receiveShadow = true;
        floorObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].sceneObj = floorObject;
        setPlaceLayout(obj.id);
        scene.add(floorObject);
      }
      break;
    case 'floorRoomsPart1':
      if (!loadTextures.floorRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.floorRooms.clone();
        currTexture.needsUpdate = true;
        var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.w};
        var w = 0.55*worldSize.w;
        var h = 0.2*worldSize.h;
        var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
        var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
        floorObject.scale.set(w, h, 1);
        floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h/2, 0);
        currTexture.repeat.set(11, 4);
        floorObject.receiveShadow = true;
        floorObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].sceneObj = floorObject;
        setPlaceLayout(obj.id);
        scene.add(floorObject);
      }
      break;
    case 'floorRoomsPart2':
      if (!loadTextures.floorRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.floorRooms.clone();
        currTexture.needsUpdate = true;
        var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.w};
        var w = 0.2*worldSize.w;
        var h = 0.45*worldSize.h;
        var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
        var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
        floorObject.scale.set(w, h, 1);
        floorObject.position.set(worldSize.w/2-w/2, worldSize.h/2-h/2, 0);
        currTexture.repeat.set(4, 9);
        floorObject.receiveShadow = true;
        floorObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].sceneObj = floorObject;
        setPlaceLayout(obj.id);
        scene.add(floorObject);
      }
      break;
    case 'floorRoomsPart3':
      if (!loadTextures.floorRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.floorRooms.clone();
        currTexture.needsUpdate = true;
        var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
        var sizeBigRoom = {w: 0.2*worldSize.w, h: 0.45*worldSize.h};
        var w = 0.55*worldSize.w;
        var h = 0.2*worldSize.h;
        var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
        var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
        floorObject.scale.set(w, h, 1);
        floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h-0.05*worldSize.w-h/2, 0);
        currTexture.repeat.set(11, 4);
        floorObject.receiveShadow = true;
        floorObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].sceneObj = floorObject;
        setPlaceLayout(obj.id);
        scene.add(floorObject);
      }
      break;
    case 'floorRoomsPart4':
      if (!loadTextures.floorRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.floorRooms.clone();
        currTexture.needsUpdate = true;
        var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.w};
        var w = 0.75*worldSize.w;
        var h = 0.2*worldSize.h;
        var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
        var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
        floorObject.scale.set(w, h, 1);
        floorObject.position.set(worldSize.w/2-w/2, worldSize.h/2-2*h-2*0.05*worldSize.h-h/2, 0);
        currTexture.repeat.set(15, 4);
        floorObject.receiveShadow = true;
        floorObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].sceneObj = floorObject;
        setPlaceLayout(obj.id);
        scene.add(floorObject);
      }
      break;
    case 'floorSecurity':
      if (!loadTextures.floorSecurity) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.floorSecurity.clone();
        currTexture.needsUpdate = true;
        var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.w};
        var w = 0.1*worldSize.w;
        var h = 0.3*worldSize.h;
        var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
        var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
        floorObject.scale.set(w, h, 1);
        floorObject.position.set(worldSize.w/2-w/2, -worldSize.h/2+h/2, 0);
        currTexture.repeat.set(2, 6);
        floorObject.castShadow = true;
        floorObject.receiveShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].sceneObj = floorObject;
        setPlaceLayout(obj.id);
        scene.add(floorObject);
      }
      break;
    case 'wallRestaurant1':
      if (!loadTextures.wallRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallRestaurant.clone();
        currTexture.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2, -worldSize.h/2+h/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture.repeat.set(16, 1);
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRestaurant2':
      if (!loadTextures.wallRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallRestaurant.clone();
        currTexture.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        objects[obj.id].size = {w: w+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+w/2, -worldSize.h/2, 5);
        currTexture.repeat.set(4, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRestaurant3':
      if (!loadTextures.wallRestaurant || !loadTextures.wallKitchen) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRestaurant.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallKitchen.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.pos*w-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+(door.pos*w-door.width/2)/2, -worldSize.h/2+h, 5);
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRestaurant4':
      if (!loadTextures.wallRestaurant || !loadTextures.wallKitchen) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRestaurant.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallKitchen.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width+2*deltaBug, wallDepth, 2);
        wallObject.position.set(-worldSize.w/2+door.pos*w, -worldSize.h/2+h, 9);
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRestaurant5':
      if (!loadTextures.wallRestaurant || !loadTextures.wallKitchen) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRestaurant.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallKitchen.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+door.pos*w+door.width/2+(w-door.pos*w-door.width/2+wallDepth/2)/2, -worldSize.h/2+h, 5);
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRestaurant6':
      if (!loadTextures.wallRestaurant || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRestaurant.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var door = {pos: 0.1, width: 6};
        objects[obj.id].size = {w: wallDepth, h: door.pos*h-door.width/2+wallDepth/2, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.pos*h-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+w, -worldSize.h/2+(door.pos*h-door.width/2)/2, 5);
        wallObject.rotation.z = -Math.PI/2;
        currTexture1.repeat.set(2, 1);
        currTexture2.repeat.set(4, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRestaurant7':
      if (!loadTextures.wallRestaurant || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRestaurant.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var door = {pos: 0.1, width: 6};
        objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width+2*deltaBug, wallDepth, 2);
        wallObject.position.set(-worldSize.w/2+w, -worldSize.h/2+door.pos*h, 9);
        wallObject.rotation.z = -Math.PI/2;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRestaurant8':
      if (!loadTextures.wallRestaurant || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRestaurant.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var door = {pos: 0.1, width: 6};
        objects[obj.id].size = {w: wallDepth, h: h-door.pos*h-door.width/2+wallDepth/2, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h-door.pos*h-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+w, -worldSize.h/2+door.pos*h+door.width/2+(h-door.pos*h-door.width/2+wallDepth/2)/2, 5);
        wallObject.rotation.z = -Math.PI/2;
        currTexture1.repeat.set(14, 1);
        currTexture2.repeat.set(28, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallKitchen1':
      if (!loadTextures.wallKitchen) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallKitchen.clone();
        currTexture.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2, worldSize.h/2-h/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture.repeat.set(16, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallKitchen2':
      if (!loadTextures.wallKitchen) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallKitchen.clone();
        currTexture.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: w+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+w/2, worldSize.h/2, 5);
        currTexture.repeat.set(16, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallKitchen3':
      if (!loadTextures.wallKitchen || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallKitchen.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+w, worldSize.h/2-h/2, 5);
        wallObject.rotation.z = -Math.PI/2;
        currTexture1.repeat.set(14, 1);
        currTexture2.repeat.set(28, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms1':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.45*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2, worldSize.h/2-h/2, 5);
        wallObject.rotation.z = -Math.PI/2;
        currTexture1.repeat.set(16, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms2':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.75*worldSize.w;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: w+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-w/2, worldSize.h/2, 5);
        currTexture1.repeat.set(26, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms3':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: w+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-w/2, worldSize.h/2-h-0.05*worldSize.h, 5);
        currTexture1.repeat.set(16, 1);
        currTexture2.repeat.set(28, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms4':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.65*worldSize.w;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: w+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.1*worldSize.w-w/2-wallDepth/4+deltaBug, worldSize.h/2-3*h-2*0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(16, 1);
        currTexture2.repeat.set(24, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms5':
      if (!loadTextures.wallRooms || !loadTextures.wallSecurity) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallSecurity.clone();
        currTexture2.needsUpdate = true;
        var w = 0.1*worldSize.w;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: w+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-w/2+wallDepth/4, worldSize.h/2-3*h-2*0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(4, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms6':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth/2, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w, worldSize.h/2-h/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms7':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-w, worldSize.h/2-h/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms8':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-2*w, worldSize.h/2-h/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms9':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-3*w, worldSize.h/2-h/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms10':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-4*w, worldSize.h/2-h/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        currTexture2.repeat.set(10, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms11':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w, worldSize.h/2-h-0.05*worldSize.h-h/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms12':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms13':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-2*w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms14':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-3*w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms15':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-3*w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms16':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-4*w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        currTexture2.repeat.set(10, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms17':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
        wallObject.rotation.z = -Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms18':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms19':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms20':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-2*w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms21':
      if (!loadTextures.wallRooms) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-3*w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms22':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-4*w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(6, 1);
        currTexture2.repeat.set(10, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms23':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.45*worldSize.h;
        objects[obj.id].size = {w: w+wallDepth-deltaBug, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w+wallDepth-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-w/2, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(6, 1);
        currTexture2.repeat.set(10, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms24':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms25':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w, worldSize.h/2-h, 9);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms26':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms27':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-w, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms28':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-w, worldSize.h/2-h, 9);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms29':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-w, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms30':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-2*w, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms31':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-2*w, worldSize.h/2-h, 9);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms32':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-2*w, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms33':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-3*w, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms34':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-3*w, worldSize.h/2-h, 9);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms35':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-wallDepth/4+deltaBug-3*w, worldSize.h/2-h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms36':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug, worldSize.h/2-2*h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms37':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w, worldSize.h/2-2*h-0.05*worldSize.h, 9);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms38':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2, worldSize.h/2-2*h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms39':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms40':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-w, worldSize.h/2-2*h-0.05*worldSize.h, 9);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms41':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms42':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-2*w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms43':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-2*w, worldSize.h/2-2*h-0.05*worldSize.h, 9);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms44':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-2*w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms45':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-3*w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms46':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-3*w, worldSize.h/2-2*h-0.05*worldSize.h, 9);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms47':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-wallDepth/4+deltaBug-3*w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
        wallObject.rotation.z = Math.PI;
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms48':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms49':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms50':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms51':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms52':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms53':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms54':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-2*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms55':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-2*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms56':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-2*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms57':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-3*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms58':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-3*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms59':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.7, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-wallDepth/4+deltaBug-3*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms60':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.8, width: 6};
        objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w*door.pos-door.width/2+wallDepth, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/4, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(3, 1);
        currTexture2.repeat.set(6, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms61':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.8, width: 6};
        objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-door.pos*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms62':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var door = {pos: 0.8, width: 6};
        objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-door.pos*w-door.width/2-(w-door.pos*w-door.width/2+wallDepth/2)/2, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
        currTexture1.repeat.set(1, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms63':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.45*worldSize.h;
        var door = {pos: 0.5, width: 6};
        objects[obj.id].size = {w: wallDepth, h: (0.05*worldSize.h-door.width-wallDepth)/2, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set((0.05*worldSize.h-door.width-wallDepth)/2+deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-w, worldSize.h/2-door.pos*h+door.width/2+((0.05*worldSize.h-door.width-wallDepth)/2)/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(0.2, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms64':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.45*worldSize.h;
        var door = {pos: 0.5, width: 6};
        objects[obj.id].size = {w: wallDepth, h: (0.05*worldSize.h-door.width-wallDepth)/2, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set((0.05*worldSize.h-door.width-wallDepth)/2+deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-w, worldSize.h/2-door.pos*h-door.width/2-((0.05*worldSize.h-door.width-wallDepth)/2)/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(0.2, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallRooms65':
      if (!loadTextures.wallRooms || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallRooms.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.2*worldSize.w;
        var h = 0.45*worldSize.h;
        var door = {pos: 0.5, width: 6};
        objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-w, worldSize.h/2-door.pos*h, 9);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallSecurity1':
      if (!loadTextures.wallSecurity) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallSecurity.clone();
        currTexture.needsUpdate = true;
        var w = 0.1*worldSize.w;
        var h = 0.3*worldSize.h;
        objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h+wallDepth, wallDepth, 10);
        wallObject.position.set(worldSize.w/2, -worldSize.h/2+h/2, 5);
        wallObject.rotation.z = -Math.PI/2;
        currTexture.repeat.set(12, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = false;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallSecurity2':
      if (!loadTextures.wallSecurity) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallSecurity.clone();
        currTexture.needsUpdate = true;
        var w = 0.1*worldSize.w;
        var h = 0.3*worldSize.h;
        objects[obj.id].size = {w: w+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(w+wallDepth, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-w/2, -worldSize.h/2, 5);
        wallObject.rotation.z = Math.PI;
        currTexture.repeat.set(4, 1);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallSecurity3':
      if (!loadTextures.wallSecurity || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallSecurity.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.1*worldSize.w;
        var h = 0.3*worldSize.h;
        var door = {pos: 0.8, width: 6};
        objects[obj.id].size = {w: wallDepth, h: door.pos*h-door.width/2+wallDepth/2-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.pos*h-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-w, -worldSize.h/2+(door.pos*h-door.width/2+wallDepth/2)/2-wallDepth/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(9, 2);
        currTexture2.repeat.set(9, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
        break;
      }
    case 'wallSecurity4':
      if (!loadTextures.wallSecurity || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallSecurity.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.1*worldSize.w;
        var h = 0.3*worldSize.h;
        var door = {pos: 0.8, width: 6};
        objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
        wallObject.position.set(worldSize.w/2-w, -worldSize.h/2+door.pos*h, 9);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(1, 0.3);
        currTexture2.repeat.set(2, 0.6);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallSecurity5':
      if (!loadTextures.wallSecurity || !loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture1 = loadTextures.wallSecurity.clone();
        currTexture1.needsUpdate = true;
        var currTexture2 = loadTextures.wallHall.clone();
        currTexture2.needsUpdate = true;
        var w = 0.1*worldSize.w;
        var h = 0.3*worldSize.h;
        var door = {pos: 0.8, width: 6};
        objects[obj.id].size = {w: wallDepth, h: h-door.pos*h-door.width/2+wallDepth/2-deltaBug, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture1, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(h-door.pos*h-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
        wallObject.position.set(worldSize.w/2-w, -worldSize.h/2+door.pos*h+door.width/2+(h-door.pos*h-door.width/2+wallDepth/2)/2, 5);
        wallObject.rotation.z = Math.PI/2;
        currTexture1.repeat.set(2, 1);
        currTexture2.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallHall1':
      if (!loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallHall.clone();
        currTexture.needsUpdate = true;
        objects[obj.id].size = {w: worldSize.w-0.2*worldSize.w-0.1*worldSize.w+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(worldSize.w-0.2*worldSize.w-0.1*worldSize.w+wallDepth, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+0.2*worldSize.w+(worldSize.w-0.2*worldSize.w-0.1*worldSize.w+wallDepth)/2, -worldSize.h/2, 5);
        wallObject.rotation.z = Math.PI;
        currTexture.repeat.set(28, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallHall2':
      if (!loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallHall.clone();
        currTexture.needsUpdate = true;
        objects[obj.id].size = {w: 0.05*worldSize.w+wallDepth, h: wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(0.05*worldSize.w+wallDepth, wallDepth, 10);
        wallObject.position.set(-worldSize.w/2+0.2*worldSize.w+(0.05*worldSize.w+wallDepth)/2, worldSize.h/2, 5);
        currTexture.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'wallHall3':
      if (!loadTextures.wallHall) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currTexture = loadTextures.wallHall.clone();
        currTexture.needsUpdate = true;
        objects[obj.id].size = {w: wallDepth, h: 0.05*worldSize.h+wallDepth, d: 10};
        var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
        var wallMaterial = [
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
          new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
        ];
        var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
        wallObject.scale.set(0.05*worldSize.h+wallDepth, wallDepth, 10);
        wallObject.rotation.z = -Math.PI/2;
        wallObject.position.set(worldSize.w/2, worldSize.h/2-0.45*worldSize.h-(0.05*worldSize.h+wallDepth)/2, 5);
        currTexture.repeat.set(2, 2);
        wallObject.receiveShadow = true;
        wallObject.castShadow = true;
        objects[obj.id].stopBullet = true;
        objects[obj.id].visibleThrough = false;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = wallObject;
        setPlaceLayout(obj.id);
        scene.add(wallObject);
      }
      break;
    case 'tableRestaurant1':
      if (!loadObjects.tableRestaurant || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_chair" || child.name == "re_chair_(1)" || child.name == "re_chair_(2)" || child.name == "re_chair_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_01" || child.name == "re_tb_01_(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 10, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+objects[obj.id].size.w/2+wallDepth/2+padding, -worldSize.h/2+objects[obj.id].size.h/2+wallDepth/2+padding, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant2':
      if (!loadObjects.tableRestaurant || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_chair" || child.name == "re_chair_(1)" || child.name == "re_chair_(2)" || child.name == "re_chair_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_01" || child.name == "re_tb_01_(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 10, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+objects[obj.id].size.w/2+wallDepth/2+padding, -worldSize.h/2+objects[obj.id].size.h/2+wallDepth/2+padding+(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant3':
      if (!loadObjects.tableRestaurant || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_chair" || child.name == "re_chair_(1)" || child.name == "re_chair_(2)" || child.name == "re_chair_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_01" || child.name == "re_tb_01_(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 10, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+objects[obj.id].size.w/2+wallDepth/2+padding, -worldSize.h/2+objects[obj.id].size.h/2+wallDepth/2+padding+2*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant4':
      if (!loadObjects.tableRestaurant || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_chair" || child.name == "re_chair_(1)" || child.name == "re_chair_(2)" || child.name == "re_chair_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_01" || child.name == "re_tb_01_(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 10, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+objects[obj.id].size.w/2+wallDepth/2+padding, -worldSize.h/2+objects[obj.id].size.h/2+wallDepth/2+padding+3*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant5':
      if (!loadObjects.tableRestaurant || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_chair" || child.name == "re_chair_(1)" || child.name == "re_chair_(2)" || child.name == "re_chair_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_01" || child.name == "re_tb_01_(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 10, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+objects[obj.id].size.w/2+wallDepth/2+padding, -worldSize.h/2+objects[obj.id].size.h/2+wallDepth/2+padding+4*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant6':
      if (!loadObjects.tableRestaurant || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_chair" || child.name == "re_chair_(1)" || child.name == "re_chair_(2)" || child.name == "re_chair_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_01" || child.name == "re_tb_01_(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 10, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+objects[obj.id].size.w/2+wallDepth/2+padding, -worldSize.h/2+objects[obj.id].size.h/2+wallDepth/2+padding+5*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant7':
      if (!loadObjects.tableRestaurant || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_chair" || child.name == "re_chair_(1)" || child.name == "re_chair_(2)" || child.name == "re_chair_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_01" || child.name == "re_tb_01_(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 10, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+objects[obj.id].size.w/2+wallDepth/2+padding, -worldSize.h/2+objects[obj.id].size.h/2+wallDepth/2+padding+6*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'counterbar':
      if (!loadObjects.counterbar || !loadTextures.counterbarCenter || !loadTextures.counterbarSide) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.counterbar.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_bar_center" || child.name == "re_bar_center(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.counterbarCenter, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_bar_side_L" || child.name == "re_bar_side_L(1)" || child.name == "re_bar_side_R" || child.name == "re_bar_side_R(1)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.counterbarSide, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 16, h: 5, d: 6};
        currScene.scale.set(4, 4, 4);
        currScene.position.set(-worldSize.w/2+objects[obj.id].size.w/2+wallDepth/2+padding/2, -worldSize.h/2+h-objects[obj.id].size.h/2-wallDepth/2-padding, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant9':
      if (!loadObjects.tableRestaurant2 || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant2.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_arm" || child.name == "re_arm_(1)" || child.name == "re_arm_(2)" || child.name == "re_arm_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_02") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+w-objects[obj.id].size.w/2-wallDepth/2-padding/2, -worldSize.h/2+h-objects[obj.id].size.h/2-padding-(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant10':
      if (!loadObjects.tableRestaurant2 || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant2.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_arm" || child.name == "re_arm_(1)" || child.name == "re_arm_(2)" || child.name == "re_arm_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_02") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+w-objects[obj.id].size.w/2-wallDepth/2-padding/2, -worldSize.h/2+h-objects[obj.id].size.h/2-padding-2*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant11':
      if (!loadObjects.tableRestaurant2 || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant2.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_arm" || child.name == "re_arm_(1)" || child.name == "re_arm_(2)" || child.name == "re_arm_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_02") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+w-objects[obj.id].size.w/2-wallDepth/2-padding/2, -worldSize.h/2+h-objects[obj.id].size.h/2-padding-3*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant12':
      if (!loadObjects.tableRestaurant2 || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant2.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_arm" || child.name == "re_arm_(1)" || child.name == "re_arm_(2)" || child.name == "re_arm_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_02") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+w-objects[obj.id].size.w/2-wallDepth/2-padding/2, -worldSize.h/2+h-objects[obj.id].size.h/2-padding-4*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant13':
      if (!loadObjects.tableRestaurant2 || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant2.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_arm" || child.name == "re_arm_(1)" || child.name == "re_arm_(2)" || child.name == "re_arm_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_02") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+w-objects[obj.id].size.w/2-wallDepth/2-padding/2, -worldSize.h/2+h-objects[obj.id].size.h/2-padding-5*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableRestaurant14':
      if (!loadObjects.tableRestaurant2 || !loadTextures.tableRestaurant || !loadTextures.chairRestaurant) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableRestaurant2.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "re_arm" || child.name == "re_arm_(1)" || child.name == "re_arm_(2)" || child.name == "re_arm_(3)") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.chairRestaurant, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "re_tb_02") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.tableRestaurant, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 14, d: 6};
        currScene.scale.set(6, 6, 6);
        currScene.position.set(-worldSize.w/2+w-objects[obj.id].size.w/2-wallDepth/2-padding/2, -worldSize.h/2+h-objects[obj.id].size.h/2-padding-6*(objects[obj.id].size.h+padding), 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'windowRestaurant1':
      if (!loadObjects.window) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.window.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "window3_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "window3_1") {
              child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 1, d: 5};
        currScene.scale.set(5, 5, 5);
        currScene.position.set(-worldSize.w/2+wallDepth/2+0.1, -worldSize.h/2+(h/5), 5);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'windowRestaurant2':
      if (!loadObjects.window) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.window.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "window3_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "window3_1") {
              child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 1, d: 5};
        currScene.scale.set(5, 5, 5);
        currScene.position.set(-worldSize.w/2+wallDepth/2+0.1, -worldSize.h/2+2*(h/5), 5);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'windowRestaurant3':
      if (!loadObjects.window) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.window.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "window3_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "window3_1") {
              child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 1, d: 5};
        currScene.scale.set(5, 5, 5);
        currScene.position.set(-worldSize.w/2+wallDepth/2+0.1, -worldSize.h/2+3*(h/5), 5);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'windowRestaurant4':
      if (!loadObjects.window) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.window.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "window3_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "window3_1") {
              child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 1, d: 5};
        currScene.scale.set(5, 5, 5);
        currScene.position.set(-worldSize.w/2+wallDepth/2+0.1, -worldSize.h/2+4*(h/5), 5);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    // case 'lightRestaurant1':
    //   var w = 0.2*worldSize.w;
    //   var h = 0.8*worldSize.h;
    //   var lightRestaurant = new THREE.PointLight(0xFFFFFF, 0.6, 50);
    //   lightRestaurant.position.set(-worldSize.w/2+w/2, -worldSize.h/2+(h/6), 10);
    //   objects[obj.id].stopBullet = false;
    //   objects[obj.id].visibleThrough = true;
    //   objects[obj.id].ghostMode = "1";
    //   objects[obj.id].sceneObj = lightRestaurant;
    //   setPlaceLayout(obj.id);
    //   scene.add(lightRestaurant);
    //   break;
    case 'washbasin':
      if (!loadObjects.washbanish) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.washbanish.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.washbanish, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 4.5, h: 4.5, d: 5};
        currScene.scale.set(2, 2, 1);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2+objects[obj.id].size.w, worldSize.h/2-objects[obj.id].size.h/2-wallDepth/2, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'countertop1':
      if (!loadObjects.countertop) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
          var currScene = loadObjects.countertop.scene.clone();
          var w = 0.2*worldSize.w;
          var h = 0.2*worldSize.h;
          var padding = 5;
          currScene.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.receiveShadow = true;
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.countertop, side: THREE.DoubleSide, skinning: true});
            }
          });
          objects[obj.id].size = {w: 4.5, h: 4.5, d: 5};
          currScene.scale.set(2, 2, 1);
          currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-objects[obj.id].size.h/2-wallDepth/2, 0);
          objects[obj.id].stopBullet = false;
          objects[obj.id].visibleThrough = true;
          objects[obj.id].ghostMode = "2";
          objects[obj.id].sceneObj = currScene;
          setPlaceLayout(obj.id);
          scene.add(currScene);
        }
        break;
    case 'countertop2':
      if (!loadObjects.countertop) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.countertop.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.countertop, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 4.5, h: 4.5, d: 5};
        currScene.scale.set(2, 2, 1);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2+2*objects[obj.id].size.w, worldSize.h/2-objects[obj.id].size.h/2-wallDepth/2, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'countertop3':
      if (!loadObjects.countertop) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.countertop.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.countertop, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 4.5, h: 4.5, d: 5};
        currScene.scale.set(2, 2, 1);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2+3*objects[obj.id].size.w, worldSize.h/2-objects[obj.id].size.h/2-wallDepth/2, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'stove1':
      if (!loadObjects.stove) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.stove.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.stove, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 4.5, h: 4.5, d: 5};
        currScene.scale.set(2, 2, 1.5);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2+4*objects[obj.id].size.w, worldSize.h/2-objects[obj.id].size.h/2-wallDepth/2, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'stove2':
      if (!loadObjects.stove) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.stove.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.stove, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 4.5, h: 4.5, d: 5};
        currScene.scale.set(2, 2, 1.5);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2+5*objects[obj.id].size.w, worldSize.h/2-objects[obj.id].size.h/2-wallDepth/2, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'stove3':
      if (!loadObjects.stove) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.stove.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.stove, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 4.5, h: 4.5, d: 5};
        currScene.scale.set(2, 2, 1.5);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2+6*objects[obj.id].size.w, worldSize.h/2-objects[obj.id].size.h/2-wallDepth/2, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'frige1':
      if (!loadObjects.frige) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.frige.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.frige, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 5, h: 5.5, d: 5};
        currScene.scale.set(2, 2, 2);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h+objects[obj.id].size.h/2+wallDepth/2, 0);
        currScene.rotation.z = Math.PI/2;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'frige2':
      if (!loadObjects.frige) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.frige.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.frige, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 5, h: 5.5, d: 5};
        currScene.scale.set(2, 2, 2);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h+objects[obj.id].size.h/2+wallDepth/2+objects[obj.id].size.h, 0);
        currScene.rotation.z = Math.PI/2;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'frige3':
      if (!loadObjects.frige) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.frige.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({map: loadTextures.frige, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 5, h: 5.5, d: 5};
        currScene.scale.set(2, 2, 2);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h+objects[obj.id].size.h/2+wallDepth/2+2*objects[obj.id].size.h, 0);
        currScene.rotation.z = Math.PI/2;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'rack1':
      if (!loadObjects.frige) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.rack.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var sizeFrige = {w: 5, h: 5.5, d: 5};
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "wood" || child.name == "wood2" || child.name == "wood3") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "mettal") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.mettalRack, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 11, d: 5};
        currScene.scale.set(2, 2, 2);
        currScene.position.set(-worldSize.w/2+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h+objects[obj.id].size.h/2+wallDepth/2+3*sizeFrige.h, 0);
        currScene.rotation.z = Math.PI/2;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'rack2':
      if (!loadObjects.frige) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.rack.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "wood" || child.name == "wood2" || child.name == "wood3") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "mettal") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.mettalRack, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 11, d: 5};
        currScene.scale.set(2, 2, 2);
        currScene.position.set(-worldSize.w/2+w-wallDepth/2-objects[obj.id].size.w/2, worldSize.h/2-h+objects[obj.id].size.h/2+wallDepth/2, 0);
        currScene.rotation.z = -Math.PI/2;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'rack3':
      if (!loadObjects.frige) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.rack.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "wood" || child.name == "wood2" || child.name == "wood3") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
            } else if (child.name == "mettal") {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.mettalRack, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 5, h: 11, d: 5};
        currScene.scale.set(2, 2, 2);
        currScene.position.set(-worldSize.w/2+w-wallDepth/2-objects[obj.id].size.w/2, worldSize.h/2-h+objects[obj.id].size.h/2+wallDepth/2+objects[obj.id].size.h, 0);
        currScene.rotation.z = -Math.PI/2;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'tableKitchen':
      if (!loadObjects.tableKitchen) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.tableKitchen.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({color: 0x111111, side: THREE.DoubleSide, skinning: true});
          }
        });
        objects[obj.id].size = {w: 8, h: 20, d: 5};
        currScene.scale.set(6, 8, 4);
        currScene.position.set(-worldSize.w/2+w/2, worldSize.h/2-3-h/2, 0);
        currScene.rotation.z = Math.PI/2;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "2";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'doorKitchen':
      if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.doorKitchen.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.2*worldSize.h;
        var padding = 5;
        var door = {pos: 0.7, width: 6}
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
            } else {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 6, h: 1, d: 5};
        currScene.scale.set(2.05, 3, 1.21);
        currScene.position.set(-worldSize.w/2+door.pos*w, worldSize.h/2-h, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'doorRestaurant':
      if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var currScene = loadObjects.doorKitchen.scene.clone();
        var w = 0.2*worldSize.w;
        var h = 0.8*worldSize.h;
        var padding = 5;
        var door = {pos: 0.1, width: 6}
        currScene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
            } else {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 6, h: 1, d: 5};
        currScene.scale.set(2.05, 3, 1.21);
        currScene.position.set(-worldSize.w/2+w, -worldSize.h/2+door.pos*h, 0);
        currScene.rotation.z = Math.PI/2;
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'door1Rooms':
      if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
        var door = {pos: 0.3, width: 6}
        var currScene = loadObjects.doorKitchen.scene.clone();
        currScene.traverse(function (child) {
              child.receiveShadow = true;
          if (child instanceof THREE.Mesh) {
            if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
            } else {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 6, h: 1, d: 5};
        currScene.scale.set(2.05, 3, 1.21);
        currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos, worldSize.h/2-h, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
    case 'door2Rooms':
      if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
        var door = {pos: 0.3, width: 6}
        var currScene = loadObjects.doorKitchen.scene.clone();
        currScene.traverse(function (child) {
              child.receiveShadow = true;
          if (child instanceof THREE.Mesh) {
            if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
            } else {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 6, h: 1, d: 5};
        currScene.scale.set(2.05, 3, 1.21);
        currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+w, worldSize.h/2-h, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
      case 'door3Rooms':
        if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
          setTimeout(function() {addScene(objects[obj.id]);}, 2000);
        } else {
          var w = 0.55*worldSize.w/4;
          var h = 0.2*worldSize.h;
          var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
          var door = {pos: 0.3, width: 6}
          var currScene = loadObjects.doorKitchen.scene.clone();
          currScene.traverse(function (child) {
              child.receiveShadow = true;
            if (child instanceof THREE.Mesh) {
              if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              } else {
                child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
              }
            }
          });
          objects[obj.id].size = {w: 6, h: 1, d: 5};
          currScene.scale.set(2.05, 3, 1.21);
          currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+2*w, worldSize.h/2-h, 0);
          objects[obj.id].stopBullet = false;
          objects[obj.id].visibleThrough = true;
          objects[obj.id].ghostMode = "1";
          objects[obj.id].sceneObj = currScene;
          setPlaceLayout(obj.id);
          scene.add(currScene);
        }
        break;
    case 'door4Rooms':
      if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
        setTimeout(function() {addScene(objects[obj.id]);}, 2000);
      } else {
        var w = 0.55*worldSize.w/4;
        var h = 0.2*worldSize.h;
        var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
        var door = {pos: 0.3, width: 6}
        var currScene = loadObjects.doorKitchen.scene.clone();
        currScene.traverse(function (child) {
              child.receiveShadow = true;
          if (child instanceof THREE.Mesh) {
            if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
              child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
            } else {
              child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
            }
          }
        });
        objects[obj.id].size = {w: 6, h: 1, d: 5};
        currScene.scale.set(2.05, 3, 1.21);
        currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+3*w, worldSize.h/2-h, 0);
        objects[obj.id].stopBullet = false;
        objects[obj.id].visibleThrough = true;
        objects[obj.id].ghostMode = "1";
        objects[obj.id].sceneObj = currScene;
        setPlaceLayout(obj.id);
        scene.add(currScene);
      }
      break;
      case 'door5Rooms':
        if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
          setTimeout(function() {addScene(objects[obj.id]);}, 2000);
        } else {
          var w = 0.55*worldSize.w/4;
          var h = 0.2*worldSize.h;
          var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
          var door = {pos: 0.3, width: 6}
          var currScene = loadObjects.doorKitchen.scene.clone();
          currScene.traverse(function (child) {
              child.receiveShadow = true;
            if (child instanceof THREE.Mesh) {
              if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              } else {
                child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
              }
            }
          });
          objects[obj.id].size = {w: 6, h: 1, d: 5};
          currScene.scale.set(2.05, 3, 1.21);
          currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos, worldSize.h/2-h-0.05*worldSize.h-h, 0);
          objects[obj.id].stopBullet = false;
          objects[obj.id].visibleThrough = true;
          objects[obj.id].ghostMode = "1";
          objects[obj.id].sceneObj = currScene;
          setPlaceLayout(obj.id);
          scene.add(currScene);
        }
        break;
      case 'door6Rooms':
        if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
          setTimeout(function() {addScene(objects[obj.id]);}, 2000);
        } else {
          var w = 0.55*worldSize.w/4;
          var h = 0.2*worldSize.h;
          var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
          var door = {pos: 0.3, width: 6}
          var currScene = loadObjects.doorKitchen.scene.clone();
          currScene.traverse(function (child) {
              child.receiveShadow = true;
            if (child instanceof THREE.Mesh) {
              if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              } else {
                child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
              }
            }
          });
          objects[obj.id].size = {w: 6, h: 1, d: 5};
          currScene.scale.set(2.05, 3, 1.21);
          currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+w, worldSize.h/2-h-0.05*worldSize.h-h, 0);
          objects[obj.id].stopBullet = false;
          objects[obj.id].visibleThrough = true;
          objects[obj.id].ghostMode = "1";
          objects[obj.id].sceneObj = currScene;
          setPlaceLayout(obj.id);
          scene.add(currScene);
        }
        break;
      case 'door7Rooms':
        if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
          setTimeout(function() {addScene(objects[obj.id]);}, 2000);
        } else {
          var w = 0.55*worldSize.w/4;
          var h = 0.2*worldSize.h;
          var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
          var door = {pos: 0.3, width: 6}
          var currScene = loadObjects.doorKitchen.scene.clone();
          currScene.traverse(function (child) {
              child.receiveShadow = true;
            if (child instanceof THREE.Mesh) {
              if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              } else {
                child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
              }
            }
          });
          objects[obj.id].size = {w: 6, h: 1, d: 5};
          currScene.scale.set(2.05, 3, 1.21);
          currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+2*w, worldSize.h/2-h-0.05*worldSize.h-h, 0);
          objects[obj.id].stopBullet = false;
          objects[obj.id].visibleThrough = true;
          objects[obj.id].ghostMode = "1";
          objects[obj.id].sceneObj = currScene;
          setPlaceLayout(obj.id);
          scene.add(currScene);
        }
        break;
      case 'door8Rooms':
        if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
          setTimeout(function() {addScene(objects[obj.id]);}, 2000);
        } else {
          var w = 0.55*worldSize.w/4;
          var h = 0.2*worldSize.h;
          var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
          var door = {pos: 0.3, width: 6}
          var currScene = loadObjects.doorKitchen.scene.clone();
          currScene.traverse(function (child) {
              child.receiveShadow = true;
            if (child instanceof THREE.Mesh) {
              if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              } else {
                child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
              }
            }
          });
          objects[obj.id].size = {w: 6, h: 1, d: 5};
          currScene.scale.set(2.05, 3, 1.21);
          currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+3*w, worldSize.h/2-h-0.05*worldSize.h-h, 0);
          objects[obj.id].stopBullet = false;
          objects[obj.id].visibleThrough = true;
          objects[obj.id].ghostMode = "1";
          objects[obj.id].sceneObj = currScene;
          setPlaceLayout(obj.id);
          scene.add(currScene);
        }
        break;
        case 'door9Rooms':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 6, h: 1, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos, worldSize.h/2-h-2*0.05*worldSize.h-h, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'door10Rooms':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 6, h: 1, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+w, worldSize.h/2-h-2*0.05*worldSize.h-h, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'door11Rooms':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 6, h: 1, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+2*w, worldSize.h/2-h-2*0.05*worldSize.h-h, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'door12Rooms':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 6, h: 1, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w*door.pos+3*w, worldSize.h/2-h-2*0.05*worldSize.h-h, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath1Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                child.receiveShadow = true;
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet1Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                child.receiveShadow = true;
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2, worldSize.h/2-h+wallDepth/2+sizeBath.h+3.5*padding+objects[obj.id].size.h/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink1Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding, worldSize.h/2-h+wallDepth/2+padding/2+objects[obj.id].size.h/2, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor1Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h+objects[obj.id].size.h/2, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall1Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h+0.5*h, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall1Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h+((h/2)*door.pos-door.width/2)/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall1Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h+(h/2)*door.pos, 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall1Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h+(h/2)*door.pos+door.width/2+((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall1Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h+0.1, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall1Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1, worldSize.h/2-h+objects[obj.id].size.h/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall1Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h+sizeBath.h+3*padding, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door1Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w, worldSize.h/2-h+(h/2)*door.pos, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard1':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable1Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable1Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed1':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-1.5*padding, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv1':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-2.5*padding, 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath2Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet2Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+w, worldSize.h/2-h+wallDepth/2+sizeBath.h+3.5*padding+objects[obj.id].size.h/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink2Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+w, worldSize.h/2-h+wallDepth/2+padding/2+objects[obj.id].size.h/2, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor2Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h+objects[obj.id].size.h/2, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall2Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h+0.5*h, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall2Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h+((h/2)*door.pos-door.width/2)/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall2Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h+(h/2)*door.pos, 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall2Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h+(h/2)*door.pos+door.width/2+((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall2Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h+0.1, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall2Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+w, worldSize.h/2-h+objects[obj.id].size.h/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall2Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h+sizeBath.h+3*padding, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door2Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+w, worldSize.h/2-h+(h/2)*door.pos, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard2':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable2Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable2Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed2':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-1.5*padding, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv2':
          if (!loadObjects.tv || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-2.5*padding, 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath3Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet3Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+wallDepth/2+sizeBath.h+3.5*padding+objects[obj.id].size.h/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink3Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+2*w, worldSize.h/2-h+wallDepth/2+padding/2+objects[obj.id].size.h/2, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor3Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+objects[obj.id].size.h/2, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall3Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+0.5*h, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall3Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h+((h/2)*door.pos-door.width/2)/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall3Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h+(h/2)*door.pos, 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall3Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h+(h/2)*door.pos+door.width/2+((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall3Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+0.1, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall3Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+2*w, worldSize.h/2-h+objects[obj.id].size.h/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall3Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+sizeBath.h+3*padding, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door3Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+2*w, worldSize.h/2-h+(h/2)*door.pos, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard3':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+2*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable3Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable3Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed3':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-1.5*padding, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv3':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+2*w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-2.5*padding, 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath4Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet4Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+wallDepth/2+sizeBath.h+3.5*padding+objects[obj.id].size.h/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink4Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+3*w, worldSize.h/2-h+wallDepth/2+padding/2+objects[obj.id].size.h/2, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor4Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+objects[obj.id].size.h/2, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall4Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+0.5*h, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall4Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h+((h/2)*door.pos-door.width/2)/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall4Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h+(h/2)*door.pos, 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall4Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h+(h/2)*door.pos+door.width/2+((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall4Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+0.1, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall4Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+3*w, worldSize.h/2-h+objects[obj.id].size.h/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall4Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+sizeBath.h+3*padding, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door4Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+3*w, worldSize.h/2-h+(h/2)*door.pos, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard4':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+3*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable4Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable4Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed4':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-1.5*padding, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv4':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+3*w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-2.5*padding, 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
          //this start
        case 'bath5Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                child.receiveShadow = true;
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet5Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                child.receiveShadow = true;
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2, worldSize.h/2-h+wallDepth/2+sizeBath.h+3.5*padding+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink5Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding, worldSize.h/2-h+wallDepth/2+padding/2+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor5Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall5Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h+0.5*h-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall5Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h+((h/2)*door.pos-door.width/2)/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall5Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h+(h/2)*door.pos-(h+0.05*worldSize.h), 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall5Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h+(h/2)*door.pos+door.width/2+((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall5Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h+0.1-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall5Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1, worldSize.h/2-h+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall5Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h+sizeBath.h+3*padding-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door5Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w, worldSize.h/2-h+(h/2)*door.pos-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard5':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable5Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed5':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-1.5*padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable5Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv5':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-2.5*padding-(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath6Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet6Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+w, worldSize.h/2-h+wallDepth/2+sizeBath.h+3.5*padding+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink6Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+w, worldSize.h/2-h+wallDepth/2+padding/2+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor6Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall6Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h+0.5*h-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall6Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h+((h/2)*door.pos-door.width/2)/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall6Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h+(h/2)*door.pos-(h+0.05*worldSize.h), 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall6Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h+(h/2)*door.pos+door.width/2+((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall6Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h+0.1-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall6Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+w, worldSize.h/2-h+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall6Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h+sizeBath.h+3*padding-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door6Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+w, worldSize.h/2-h+(h/2)*door.pos-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard6':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable6Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed6':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-1.5*padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable6Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv6':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-2.5*padding-(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath7Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet7Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+wallDepth/2+sizeBath.h+3.5*padding+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink7Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+2*w, worldSize.h/2-h+wallDepth/2+padding/2+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor7Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall7Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+0.5*h-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall7Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h+((h/2)*door.pos-door.width/2)/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall7Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h+(h/2)*door.pos-(h+0.05*worldSize.h), 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall7Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h+(h/2)*door.pos+door.width/2+((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall7Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+0.1-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall7Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+2*w, worldSize.h/2-h+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall7Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h+sizeBath.h+3*padding-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door7Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+2*w, worldSize.h/2-h+(h/2)*door.pos-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard7':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+2*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable7Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed7':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-1.5*padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable7Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv7':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+2*w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-2.5*padding-(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath8Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet8Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+wallDepth/2+sizeBath.h+3.5*padding+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink8Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+3*w, worldSize.h/2-h+wallDepth/2+padding/2+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor8Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall8Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+0.5*h-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall8Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h+((h/2)*door.pos-door.width/2)/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall8Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h+(h/2)*door.pos-(h+0.05*worldSize.h), 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall8Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h+(h/2)*door.pos+door.width/2+((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall8Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+0.1-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall8Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+3*w, worldSize.h/2-h+objects[obj.id].size.h/2-(h+0.05*worldSize.h), 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall8Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h+sizeBath.h+3*padding-(h+0.05*worldSize.h), 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door8Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+3*w, worldSize.h/2-h+(h/2)*door.pos-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard8':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+3*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable8Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed8':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-1.5*padding-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable8Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2-(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv8':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+3*w, worldSize.h/2-wallDepth/2-sizeBedsideTable.h-objects[obj.id].size.h/2-2.5*padding-(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath9Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet9Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2, worldSize.h/2-h-wallDepth/2-sizeBath.h-3.5*padding-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink9Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding, worldSize.h/2-h-wallDepth/2-padding/2-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor9Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall9Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h-0.5*h-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall9Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h-((h/2)*door.pos-door.width/2)/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall9Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h-(h/2)*door.pos-(h+0.05*worldSize.h)-0.05*worldSize.h, 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall9Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h-(h/2)*door.pos-door.width/2-((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall9Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h-0.1-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall9Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1, worldSize.h/2-h-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall9Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2, worldSize.h/2-h-sizeBath.h-3*padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door9Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w, worldSize.h/2-h-(h/2)*door.pos-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard9':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable9Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed9':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+1.5*padding-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable9Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv9':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+2.5*padding-2*(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
          //this start
        case 'bath10Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet10Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+w, worldSize.h/2-h-wallDepth/2-sizeBath.h-3.5*padding-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink10Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+w, worldSize.h/2-h-wallDepth/2-padding/2-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor10Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall10Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h-0.5*h-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall10Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h-((h/2)*door.pos-door.width/2)/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall10Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h-(h/2)*door.pos-(h+0.05*worldSize.h)-0.05*worldSize.h, 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall10Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-h-(h/2)*door.pos-door.width/2-((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall10Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h-0.1-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall10Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+w, worldSize.h/2-h-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall10Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+w, worldSize.h/2-h-sizeBath.h-3*padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door10Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+w, worldSize.h/2-h-(h/2)*door.pos-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard10':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+w, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable10Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed10':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+1.5*padding-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable10Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+w, worldSize.h/2-h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv10':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+w, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+2.5*padding-2*(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath11Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet11Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+2*w, worldSize.h/2-h-wallDepth/2-sizeBath.h-3.5*padding-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink11Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+2*w, worldSize.h/2-h-wallDepth/2-padding/2-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor11Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall11Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h-0.5*h-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall11Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h-((h/2)*door.pos-door.width/2)/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall11Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h-(h/2)*door.pos-(h+0.05*worldSize.h)-0.05*worldSize.h, 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall11Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-h-(h/2)*door.pos-door.width/2-((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall11Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h-0.1-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall11Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+2*w, worldSize.h/2-h-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall11Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+2*w, worldSize.h/2-h-sizeBath.h-3*padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door11Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+2*w, worldSize.h/2-h-(h/2)*door.pos-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard11':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+2*w, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable11Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed11':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+1.5*padding-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable11Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+2*w, worldSize.h/2-h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv11':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+2*w, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+2.5*padding-2*(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
          //this start 3
        case 'bath12Rooms':
          if (!loadObjects.bath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.3, width: 6}
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currScene = loadObjects.bath.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "bath") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC1B697, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "legs") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x313234, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 8, d: 5};
            currScene.scale.set(5, 5, 5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'toilet12Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2+3*w, worldSize.h/2-h-wallDepth/2-sizeBath.h-3.5*padding-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink12Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-sizeBath.w-objects[obj.id].size.w/2-2*padding+3*w, worldSize.h/2-h-wallDepth/2-padding/2-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'floor12Bath':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.floorBath, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            objects[obj.id].size = {w: 0.5*w, h: 0.5*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'wall12Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h-0.5*h-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall12Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.5, 1);
            currTexture2.repeat.set(1.5, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)*door.pos-door.width/2, d: 10};
            wallObject.scale.set((h/2)*door.pos-door.width/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h-((h/2)*door.pos-door.width/2)/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall12Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1, 0.2);
            currTexture2.repeat.set(1, 0.2);
            objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
            wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h-(h/2)*door.pos-(h+0.05*worldSize.h)-0.05*worldSize.h, 9);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = false;
            wallObject.castShadow = false;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall12Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.7, width: 6};
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.5, 1);
            currTexture2.repeat.set(0.3, 1);
            objects[obj.id].size = {w: wallDepth, h: (h/2)-(h/2)*door.pos-door.width/2+wallDepth/2, d: 10};
            wallObject.scale.set((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-h-(h/2)*door.pos-door.width/2-((h/2)-(h/2)*door.pos-door.width/2+wallDepth/2)/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall12Bath5':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h-0.1-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall12Bath6':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(3, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*h, d: 10};
            wallObject.scale.set(0.5*h-deltaBug, wallDepth, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-0.1+3*w, worldSize.h/2-h-objects[obj.id].size.h/2-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall12Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var padding = 2;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x2F8352, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w-deltaBug, wallDepth/2, 10);
            wallObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-objects[obj.id].size.w/2+3*w, worldSize.h/2-h-sizeBath.h-3*padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door12Bath':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var door = {pos: 0.7, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 1, h: 6, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+0.5*w+3*w, worldSize.h/2-h-(h/2)*door.pos-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard12':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+3*w, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable12Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed12':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+1.5*padding-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable12Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w-wallDepth/2-objects[obj.id].size.w/2-padding/2+3*w, worldSize.h/2-h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv12':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.55*worldSize.w/4;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+wallDepth/2+objects[obj.id].size.w/2+3*w, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+2.5*padding-2*(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'door13Rooms':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.8, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 6, h: 1, d: 5};
            currScene.scale.set(2.05, 3, 1.21);
            currScene.position.set(worldSize.w/2-w*door.pos, worldSize.h/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'wall13Bath1':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            currTexture.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.2, 1);
            objects[obj.id].size = {w: 0.3*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.3*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-2*(h+0.05*worldSize.h)-0.2*h, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath2':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: 0.5*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-2*(h+0.05*worldSize.h)-0.5*h, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath3':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(1.2, 1);
            currTexture2.repeat.set(1.2, 1);
            objects[obj.id].size = {w: 0.3*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.3*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-2*(h+0.05*worldSize.h)-0.1, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath4':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(2, 1);
            currTexture2.repeat.set(2, 1);
            objects[obj.id].size = {w: wallDepth, h: 0.5*w, d: 10};
            wallObject.scale.set(0.5*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-0.1, worldSize.h/2-2*(h+0.05*worldSize.h)-objects[obj.id].size.h/2, 5);
            wallObject.rotation.z = Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath5':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 1);
            currTexture2.repeat.set(0.8, 1);
            objects[obj.id].size = {w: 0.2*w, h: wallDepth, d: 10};
            wallObject.scale.set(0.2*w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-0.3*w-objects[obj.id].size.w/2, worldSize.h/2-2*(h+0.05*worldSize.h)-0.2*h, 5);
            wallObject.rotation.z = Math.PI;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'door13Rooms2':
          if (!loadObjects.doorKitchen2 || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.8, width: 6}
            var currScene = loadObjects.doorKitchen2.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 6, h: 1, d: 5};
            currScene.scale.set(2.15, 2, 1.21);
            currScene.position.set(worldSize.w/2-0.3*w, worldSize.h/2-2*(h+0.05*worldSize.h)-0.1*h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'door13Rooms3':
          if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var door = {pos: 0.8, width: 6}
            var currScene = loadObjects.doorKitchen.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 6, h: 1, d: 5};
            currScene.scale.set(2.4, 3, 1.21);
            currScene.position.set(worldSize.w/2-0.5*w, worldSize.h/2-2*(h+0.05*worldSize.h)-0.35*h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'wall13Bath6':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 0.2);
            currTexture2.repeat.set(0.8, 0.2);
            objects[obj.id].size = {w: wallDepth, h: 0.2*w, d: 2};
            wallObject.scale.set(0.2*w+wallDepth-deltaBug, wallDepth, 2);
            wallObject.position.set(worldSize.w/2-0.3*w, worldSize.h/2-2*(h+0.05*worldSize.h)-0.1*h, 9);
            wallObject.rotation.z = -Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath7':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.8, 0.2);
            currTexture2.repeat.set(0.8, 0.2);
            objects[obj.id].size = {w: wallDepth, h: 0.2*w, d: 2};
            wallObject.scale.set(0.2*w+wallDepth-deltaBug, wallDepth, 2);
            wallObject.position.set(worldSize.w/2-0.5*w, worldSize.h/2-2*(h+0.05*worldSize.h)-0.35*h, 9);
            wallObject.rotation.z = -Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath8':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.4, 1);
            currTexture2.repeat.set(0.4, 1);
            objects[obj.id].size = {w: 2, h: wallDepth, d: 10};
            wallObject.scale.set(2+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-0.5*w, worldSize.h/2-2*(h+0.05*worldSize.h)-0.2*h-objects[obj.id].size.w/2, 5);
            wallObject.rotation.z = -Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath9':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.4, 1);
            currTexture2.repeat.set(0.4, 1);
            objects[obj.id].size = {w: 2, h: wallDepth, d: 10};
            wallObject.scale.set(2+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-0.5*w, worldSize.h/2-2*(h+0.05*worldSize.h)-0.5*h+objects[obj.id].size.w/2, 5);
            wallObject.rotation.z = -Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath10':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.2, 1);
            currTexture2.repeat.set(0.2, 1);
            objects[obj.id].size = {w: 0.5, h: wallDepth, d: 10};
            wallObject.scale.set(0.5+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-0.3*w, worldSize.h/2-2*(h+0.05*worldSize.h)-objects[obj.id].size.w/2, 5);
            wallObject.rotation.z = -Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'wall13Bath11':
          if (!loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(0.2, 1);
            currTexture2.repeat.set(0.2, 1);
            objects[obj.id].size = {w: 0.5, h: wallDepth, d: 10};
            wallObject.scale.set(0.5+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-0.3*w, worldSize.h/2-2*(h+0.05*worldSize.h)-0.2*h+objects[obj.id].size.w/2, 5);
            wallObject.rotation.z = -Math.PI/2;
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
        case 'floor13Bath1':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currTexture = loadTextures.floorBath.clone();
            currTexture.needsUpdate = true;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            currTexture.repeat.set(0.6, 0.4);
            objects[obj.id].size = {w: 0.3*w, h: 0.2*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-2*(h+0.05*worldSize.h)-objects[obj.id].size.h/2, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'floor13Bath2':
          if (!loadTextures.floorBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currTexture = loadTextures.floorBath.clone();
            currTexture.needsUpdate = true;
            var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
            var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
            var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
            currTexture.repeat.set(1, 0.6);
            objects[obj.id].size = {w: 0.5*w, h: 0.3*h, d: 0.1};
            floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
            floorObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-2*(h+0.05*worldSize.h)-0.2*h-objects[obj.id].size.h/2, 0.1);
            floorObject.receiveShadow = true;
            floorObject.castShadow = true;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].sceneObj = floorObject;
            setPlaceLayout(obj.id);
            scene.add(floorObject);
          }
          break;
        case 'toilet13Rooms':
          if (!loadObjects.toilet) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6}
            var padding = 2;
            var currScene = loadObjects.toilet.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "toilet") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "cover") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 3, d: 5};
            currScene.scale.set(3, 3, 3);
            currScene.position.set(worldSize.w/2-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-2*(h+0.05*worldSize.h)-0.1*h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bath13Rooms':
          if (!loadObjects.bath2) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var door = {pos: 0.3, width: 6};
            var padding = 2;
            var currScene = loadObjects.bath2.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "wood") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFEE9D2, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 7, d: 5};
            currScene.scale.set(3.5, 4, 4);
            currScene.position.set(worldSize.w/2-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-2*(h+0.05*worldSize.h)-0.35*h, 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'sink13Rooms':
          if (!loadObjects.sink) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBath = { w: 4, h: 8 };
            var sizeToilet = { w: 4, h: 3 };
            var door = {pos: 0.3, width: 6};
            var padding = 2;
            var currScene = loadObjects.sink.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "crane") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                } else if (child.name == "sink") {
                  child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2.5, 2.5, 2.5);
            currScene.position.set(worldSize.w/2-0.4*w, worldSize.h/2-2*(h+0.05*worldSize.h)-0.5*h+objects[obj.id].size.h/2+wallDepth/2, 0);
            currScene.rotation.z = Math.PI;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'cupboard13':
          if (!loadObjects.cupboard) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var padding = 2;
            var currScene = loadObjects.cupboard.scene.clone();
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                  child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 4, h: 12, d: 5};
            currScene.scale.set(6, 5, 4);
            currScene.position.set(worldSize.w/2-w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h-wallDepth/2-objects[obj.id].size.h/2-padding-(h+0.05*worldSize.h)-0.05*worldSize.h, 0);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable13Room1':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(worldSize.w/2-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bed13':
          if (!loadObjects.bed || !loadTextures.bed) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.bed.scene.clone();
            var currTexture = loadTextures.bed.clone();
            currTexture.needsUpdate = true;
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                if (child.name == 'legs') {
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                } else {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              }
            });
            objects[obj.id].size = {w: 10, h: 7, d: 5};
            currScene.scale.set(1.8, 1.5, 1.8);
            currScene.position.set(worldSize.w/2-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+1.5*padding-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'bedsideTable13Room2':
          if (!loadObjects.bedsideTable) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currScene = loadObjects.bedsideTable.scene.clone();
            var padding = 2;
            currScene.traverse(function (child) {
              child.receiveShadow = true;
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
              }
            });
            objects[obj.id].size = {w: 3, h: 3, d: 5};
            currScene.scale.set(2, 2, 2);
            currScene.position.set(worldSize.w/2-wallDepth/2-objects[obj.id].size.w/2-padding/2, worldSize.h/2-h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2-2*(h+0.05*worldSize.h), 0);
            currScene.rotation.z = -Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'tv13':
          if (!loadObjects.tv) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.2*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var sizeBedsideTable = { w: 3, h: 3 };
            var currScene = loadObjects.tv.scene.clone();
            var padding = 2;
            objects[obj.id].size = {w: 0.5, h: 3, d: 5};
            currScene.scale.set(4, 4, 4);
            currScene.position.set(worldSize.w/2-w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+2.5*padding-2*(h+0.05*worldSize.h), 5);
            currScene.rotation.z = Math.PI/2;
            objects[obj.id].stopBullet = false;
            objects[obj.id].visibleThrough = true;
            objects[obj.id].ghostMode = "1";
            objects[obj.id].sceneObj = currScene;
            setPlaceLayout(obj.id);
            scene.add(currScene);
          }
          break;
        case 'wall14Bath1':
          if (!loadTextures.wallRooms || !loadTextures.wallBath) {
            setTimeout(function() {addScene(objects[obj.id]);}, 2000);
          } else {
            var w = 0.2*worldSize.w;
            var h = 0.45*worldSize.h;
            var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
            var currTexture = loadTextures.wallBath.clone();
            var currTexture2 = loadTextures.wallRooms.clone();
            currTexture.needsUpdate = true;
            currTexture2.needsUpdate = true;
            var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
            var wallMaterial = [
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
              new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
            ];
            var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
            currTexture.repeat.set(6, 1);
            currTexture2.repeat.set(6, 1);
            objects[obj.id].size = {w: w, h: wallDepth, d: 10};
            wallObject.scale.set(w+wallDepth-deltaBug, wallDepth, 10);
            wallObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-0.1, 5);
            wallObject.receiveShadow = true;
            wallObject.castShadow = true;
            objects[obj.id].stopBullet = true;
            objects[obj.id].visibleThrough = false;
            objects[obj.id].ghostMode = "2";
            objects[obj.id].sceneObj = wallObject;
            setPlaceLayout(obj.id);
            scene.add(wallObject);
          }
          break;
          case 'wall14Bath2':
            if (!loadTextures.wallRooms || !loadTextures.wallBath) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallBath.clone();
              var currTexture2 = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              currTexture2.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(3, 1);
              currTexture2.repeat.set(3, 1);
              objects[obj.id].size = {w: wallDepth, h: 0.2*h, d: 10};
              wallObject.scale.set(0.2*h+wallDepth-deltaBug, wallDepth, 10);
              wallObject.position.set(worldSize.w/2-0.1, worldSize.h/2-objects[obj.id].size.h/2, 5);
              wallObject.rotation.z = -Math.PI/2;
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = false;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'wall14Bath3':
            if (!loadTextures.wallRooms || !loadTextures.wallBath) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallBath.clone();
              var currTexture2 = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              currTexture2.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(3, 1);
              currTexture2.repeat.set(3, 1);
              objects[obj.id].size = {w: wallDepth, h: 0.2*h, d: 10};
              wallObject.scale.set(0.2*h+wallDepth-deltaBug, wallDepth, 10);
              wallObject.position.set(worldSize.w/2-w+0.1, worldSize.h/2-objects[obj.id].size.h/2, 5);
              wallObject.rotation.z = Math.PI/2;
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = false;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'wall14Bath4':
            if (!loadTextures.wallBath) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallBath.clone();
              currTexture.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(3, 1);
              objects[obj.id].size = {w: wallDepth, h: 0.2*h, d: 10};
              wallObject.scale.set(0.2*h+wallDepth-deltaBug, wallDepth, 10);
              wallObject.position.set(worldSize.w/2-0.2*w, worldSize.h/2-objects[obj.id].size.h/2, 5);
              wallObject.rotation.z = Math.PI/2;
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = false;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'door14Bath1':
            if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currScene = loadObjects.doorKitchen2.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 1, h: 6, d: 5};
              currScene.scale.set(2.05, 2, 1.21);
              currScene.position.set(worldSize.w/2-0.1*w, worldSize.h/2-0.2*h, 0);
              currScene.rotation.z = Math.PI;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'door14Bath2':
            if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currScene = loadObjects.doorKitchen2.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 1, h: 6, d: 5};
              currScene.scale.set(2.05, 2, 1.21);
              currScene.position.set(worldSize.w/2-0.3*w, worldSize.h/2-0.2*h, 0);
              currScene.rotation.z = Math.PI;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'wall14Bath5':
            if (!loadTextures.wallBath || !loadTextures.wallRooms) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallBath.clone();
              var currTexture2 = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              currTexture2.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(1, 0.2);
              currTexture2.repeat.set(1, 0.2);
              objects[obj.id].size = {w: 6, h: wallDepth, d: 2};
              wallObject.scale.set(6-deltaBug, wallDepth, 2);
              wallObject.position.set(worldSize.w/2-0.1*w, worldSize.h/2-0.2*h, 9);
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'wall14Bath6':
            if (!loadTextures.wallBath || !loadTextures.wallRooms) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallBath.clone();
              var currTexture2 = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              currTexture2.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(1, 0.2);
              currTexture2.repeat.set(1, 0.2);
              objects[obj.id].size = {w: 6, h: wallDepth, d: 2};
              wallObject.scale.set(6-deltaBug, wallDepth, 2);
              wallObject.position.set(worldSize.w/2-0.3*w, worldSize.h/2-0.2*h, 9);
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'wall14Bath7':
            if (!loadTextures.wallRooms || !loadTextures.wallBath) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallBath.clone();
              var currTexture2 = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              currTexture2.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(0.2, 1);
              currTexture2.repeat.set(0.2, 1);
              objects[obj.id].size = {w: 0.7, h: wallDepth, d: 10};
              wallObject.scale.set(0.7+wallDepth-deltaBug, wallDepth, 10);
              wallObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-0.2*h, 5);
              wallObject.rotation.z = Math.PI;
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = false;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'wall14Bath8':
            if (!loadTextures.wallRooms || !loadTextures.wallBath) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallBath.clone();
              var currTexture2 = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              currTexture2.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(0.5, 1);
              currTexture2.repeat.set(0.5, 1);
              objects[obj.id].size = {w: 1.5, h: wallDepth, d: 10};
              wallObject.scale.set(1.5+wallDepth-deltaBug, wallDepth, 10);
              wallObject.position.set(worldSize.w/2-0.2*w, worldSize.h/2-0.2*h, 5);
              wallObject.rotation.z = Math.PI;
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = false;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'wall14Bath9':
            if (!loadTextures.wallRooms || !loadTextures.wallBath) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallBath.clone();
              var currTexture2 = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              currTexture2.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture2, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(4, 1);
              currTexture2.repeat.set(4, 1);
              objects[obj.id].size = {w: 0.7*w-3, h: wallDepth, d: 10};
              wallObject.scale.set(0.7*w-3, wallDepth, 10);
              wallObject.position.set(worldSize.w/2-w+objects[obj.id].size.w/2+0.2, worldSize.h/2-0.2*h, 5);
              wallObject.rotation.z = Math.PI;
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = false;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'floor14Bath':
            if (!loadTextures.floorBath) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var padding = 2;
              var currTexture = loadTextures.floorBath.clone();
              currTexture.needsUpdate = true;
              var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
              var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
              var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
              currTexture.repeat.set(4, 3);
              objects[obj.id].size = {w: w, h: 0.2*h, d: 0.1};
              floorObject.scale.set(objects[obj.id].size.w, objects[obj.id].size.h, 1);
              floorObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-objects[obj.id].size.h/2, 0.1);
              floorObject.receiveShadow = true;
              floorObject.castShadow = true;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].sceneObj = floorObject;
              setPlaceLayout(obj.id);
              scene.add(floorObject);
            }
            break;
          case 'toilet14Rooms':
            if (!loadObjects.toilet) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.2*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var sizeBath = { w: 4, h: 8 };
              var door = {pos: 0.3, width: 6}
              var padding = 2;
              var currScene = loadObjects.toilet.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "toilet") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "cover") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x48A2A6, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 4, h: 3, d: 5};
              currScene.scale.set(3, 3, 3);
              currScene.position.set(worldSize.w/2-0.1*w, worldSize.h/2-wallDepth/2-objects[obj.id].size.h/2-padding/2, 0);
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'bath14Rooms1':
            if (!loadObjects.bath3) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var sizeBath = { w: 4, h: 8 };
              var door = {pos: 0.3, width: 6};
              var padding = 2;
              var currScene = loadObjects.bath3.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "crane") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x999999, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "bath") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 8, h: 12, d: 5};
              currScene.scale.set(10, 10, 4);
              currScene.position.set(worldSize.w/2-w+objects[obj.id].size.w/2+padding/2, worldSize.h/2-0.1*h, 0);
              currScene.rotation.z = -Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'sink14Rooms':
            if (!loadObjects.sink) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var padding = 2;
              var currScene = loadObjects.sink.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "crane") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xC6C6C6, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "sink") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xF6EFD9, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 3, h: 3, d: 5};
              currScene.scale.set(2.5, 2.5, 2.5);
              currScene.position.set(worldSize.w/2-0.6*w, worldSize.h/2-0.2*h+objects[obj.id].size.h/2+wallDepth/2, 0);
              currScene.rotation.z = Math.PI;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'shower14Rooms':
            if (!loadObjects.shower) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var padding = 2;
              var currScene = loadObjects.shower.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "Object_5") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({color: 0x999999, side: THREE.DoubleSide, skinning: true});
                  }

                }
              });
              objects[obj.id].size = {w: 5, h: 5, d: 5};
              currScene.scale.set(6, 6, 6);
              currScene.position.set(worldSize.w/2-0.4*w, worldSize.h/2-objects[obj.id].size.h/2-wallDepth/2-padding/2, 1);
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'wall14Bath10':
            if (!loadTextures.wallRooms) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(0.2, 1);
              objects[obj.id].size = {w: 0.7, h: wallDepth, d: 10};
              wallObject.scale.set(0.7+wallDepth-deltaBug, wallDepth, 10);
              wallObject.position.set(worldSize.w/2-objects[obj.id].size.w/2, worldSize.h/2-0.8*h, 5);
              wallObject.rotation.z = Math.PI;
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = false;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'wall14Bath11':
            if (!loadTextures.wallBath || !loadTextures.wallRooms) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(1, 0.2);
              objects[obj.id].size = {w: 6, h: wallDepth, d: 2};
              wallObject.scale.set(6-deltaBug, wallDepth, 2);
              wallObject.position.set(worldSize.w/2-0.1*w, worldSize.h/2-0.8*h, 9);
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'wall14Bath12':
            if (!loadTextures.wallRooms || !loadTextures.wallBath) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currTexture = loadTextures.wallRooms.clone();
              currTexture.needsUpdate = true;
              var wallGeometry = new THREE.BoxGeometry(1, 1, 1);
              var wallMaterial = [
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
                new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide})
              ];
              var wallObject = new THREE.Mesh(wallGeometry, wallMaterial);
              currTexture.repeat.set(4, 1);
              objects[obj.id].size = {w: w-0.1*w-3, h: wallDepth, d: 10};
              wallObject.scale.set(w-0.1*w-3+0.3, wallDepth, 10);
              wallObject.position.set(worldSize.w/2-w+objects[obj.id].size.w/2, worldSize.h/2-0.8*h, 5);
              wallObject.rotation.z = Math.PI;
              wallObject.receiveShadow = true;
              wallObject.castShadow = true;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = false;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = wallObject;
              setPlaceLayout(obj.id);
              scene.add(wallObject);
            }
            break;
          case 'door14Bath3':
            if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currScene = loadObjects.doorKitchen2.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 1, h: 6, d: 5};
              currScene.scale.set(2.05, 2, 1.21);
              currScene.position.set(worldSize.w/2-0.1*w, worldSize.h/2-0.8*h, 0);
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'bedsideTable14Room1':
            if (!loadObjects.bedsideTable) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currScene = loadObjects.bedsideTable.scene.clone();
              var padding = 2;
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                }
              });
              objects[obj.id].size = {w: 3, h: 3, d: 5};
              currScene.scale.set(2, 2, 2);
              currScene.position.set(worldSize.w/2-w+wallDepth/2+objects[obj.id].size.w/2+padding/2, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2+padding/2, 0);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'bed14':
            if (!loadObjects.bed || !loadTextures.bed) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var sizeBedsideTable = { w: 3, h: 3 };
              var currScene = loadObjects.bed.scene.clone();
              var currTexture = loadTextures.bed.clone();
              currTexture.needsUpdate = true;
              var padding = 2;
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == 'legs') {
                    child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 10, h: 7, d: 5};
              currScene.scale.set(1.8, 1.5, 1.8);
              currScene.position.set(worldSize.w/2-w+wallDepth/2+objects[obj.id].size.w/2+padding/2, worldSize.h/2-h+wallDepth/2+sizeBedsideTable.h+objects[obj.id].size.h/2+padding, 0);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'bedsideTable14Room2':
            if (!loadObjects.bedsideTable) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currScene = loadObjects.bedsideTable.scene.clone();
              var padding = 2;
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                }
              });
              objects[obj.id].size = {w: 3, h: 3, d: 5};
              currScene.scale.set(2, 2, 2);
              currScene.position.set(worldSize.w/2-w+wallDepth/2+objects[obj.id].size.w/2+padding/2, worldSize.h/2-0.8*h-wallDepth/2-objects[obj.id].size.h/2-padding/2, 0);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'cupboard14':
            if (!loadObjects.cupboard) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var padding = 2;
              var currScene = loadObjects.cupboard.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 12, h: 4, d: 5};
              currScene.scale.set(6, 5, 4);
              currScene.position.set(worldSize.w/2-w*0.3, worldSize.h/2-h+wallDepth/2+objects[obj.id].size.h/2, 0);
              currScene.rotation.z = Math.PI;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'sofa14':
            if (!loadObjects.sofa || !loadTextures.sofa) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var padding = 2;
              var currScene = loadObjects.sofa.scene.clone();
              var currTexture = loadTextures.sofa.clone();
              currTexture.needsUpdate = true;
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  child.material = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide, skinning: true});
                }
              });
              objects[obj.id].size = {w: 6, h: 15, d: 5};
              currScene.scale.set(8, 8, 8);
              currScene.position.set(worldSize.w/2-w+wallDepth/2+objects[obj.id].size.w/2+5*padding, worldSize.h/2-0.8*h+wallDepth/2+objects[obj.id].size.h/2+padding, 0);
              currScene.rotation.z = -Math.PI/2;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'tv14':
            if (!loadObjects.tv) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var sizeSofa = {w: 6, h: 15};
              var sizeBedsideTable = { w: 3, h: 3 };
              var currScene = loadObjects.tv.scene.clone();
              var padding = 2;
              objects[obj.id].size = {w: 0.5, h: 3, d: 5};
              currScene.scale.set(4, 4, 4);
              currScene.position.set(worldSize.w/2-w+wallDepth/2+objects[obj.id].size.w/2, worldSize.h/2-0.8*h+padding+wallDepth/2+sizeSofa.h/2+objects[obj.id].size.h/2, 5);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'poolTable14':
            if (!loadObjects.poolTable) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var currScene = loadObjects.poolTable.scene.clone();
              var padding = 2;
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "green1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x00C92F, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 8, h: 16, d: 5};
              currScene.scale.set(6, 6, 4);
              currScene.position.set(worldSize.w/2-w+wallDepth/2+objects[obj.id].size.w/2+4*padding, worldSize.h/2-0.2*h-padding-wallDepth/2-objects[obj.id].size.h/2-2*padding, 0);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'door14Bath4':
            if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currScene = loadObjects.doorKitchen.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 1, h: 6, d: 5};
              currScene.scale.set(2.05, 2, 1.21);
              currScene.position.set(worldSize.w/2-w, worldSize.h/2-0.5*h, 0);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'cctvSecurity':
            if (!loadObjects.cctv) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.1*worldSize.w;
              var h = 0.3*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var padding = 2;
              var currScene = loadObjects.cctv.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name.substr(0, 8) == "1monitor") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x333333, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 15, h: 5, d: 5};
              currScene.scale.set(3, 3, 2);
              currScene.position.set(worldSize.w/2-w/2, -worldSize.h/2+wallDepth/2+objects[obj.id].size.h/2+padding/2, 0);
              currScene.rotation.z = Math.PI;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'doorSecurity':
            if (!loadObjects.doorKitchen || !loadTextures.woodRack) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.1*worldSize.w;
              var h = 0.3*worldSize.h;
              var sizeKitchen = { w: 0.2*worldSize.w, h: 0.2*worldSize.h };
              var currScene = loadObjects.doorKitchen.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "Mesh2_Steve_Book_0" || child.name == "Mesh4_Steve_Book_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 1, h: 6, d: 5};
              currScene.scale.set(2.05, 2, 1.21);
              currScene.position.set(worldSize.w/2-w, -worldSize.h/2+0.8*h, 0);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'cupboardSecurity1':
            if (!loadObjects.cupboard) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.1*worldSize.w;
              var h = 0.3*worldSize.h;
              var padding = 2;
              var currScene = loadObjects.cupboard.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 4, h: 12, d: 5};
              currScene.scale.set(6, 5, 4);
              currScene.position.set(worldSize.w/2-wallDepth/2-objects[obj.id].size.w/2, -worldSize.h/2+0.4*h, 0);
              currScene.rotation.z = -Math.PI/2;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'cupboardSecurity2':
            if (!loadObjects.cupboard) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.1*worldSize.w;
              var h = 0.3*worldSize.h;
              var padding = 2;
              var currScene = loadObjects.cupboard.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "L_door_handle_0" || child.name == "R_door_handle_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({color: 0x56270D, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 4, h: 12, d: 5};
              currScene.scale.set(6, 5, 4);
              currScene.position.set(worldSize.w/2-wallDepth/2-objects[obj.id].size.w/2, -worldSize.h/2+0.7*h, 0);
              currScene.rotation.z = -Math.PI/2;
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'reception':
            if (!loadObjects.reception) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var padding = 2;
              var currScene = loadObjects.reception.scene.clone();
              var sizeSecurity = { w: 0.1*worldSize.w, h: 0.3*worldSize.h };
              var sizeRestaurant = { w: 0.2*worldSize.w, h: 0.8*worldSize.h };
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name.substr(0, 4) == "wood") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xFFC375, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name.substr(0, 6) == "chrome") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x8F8F8F, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 18, h: 8, d: 5};
              currScene.scale.set(3, 3, 2);
              currScene.position.set(-worldSize.w/2+sizeRestaurant.w+0.05*worldSize.w+objects[obj.id].size.w/2+5*padding, -worldSize.h/2+sizeSecurity.h-2*padding-objects[obj.id].size.h/2, 0);
              objects[obj.id].stopBullet = true;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'chairSecurity':
            if (!loadObjects.chair) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var padding = 2;
              var currScene = loadObjects.chair.scene.clone();
              var w = 0.1*worldSize.w;
              var h = 0.3*worldSize.h;
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name.substr(0, 5) == "black") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x333333, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name.substr(0, 6) == "chrome") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x999999, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 4, h: 4, d: 5};
              currScene.scale.set(6, 6, 4);
              currScene.position.set(worldSize.w/2-w/2, -worldSize.h/2+0.17*h, 0);
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "2";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'doorMain':
            if (!loadObjects.doorMain || !loadTextures.woodRack) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var currScene = loadObjects.doorMain.scene.clone();
              currScene.traverse(function (child) {
                child.receiveShadow = true;
                if (child instanceof THREE.Mesh) {
                  if (child.name == "door1_2" || child.name == "door2_3") {
                    child.material = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide, skinning: true});
                  } else {
                    child.material = new THREE.MeshPhongMaterial({map: loadTextures.woodRack, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 12, h: 1, d: 5};
              currScene.scale.set(2.05, 2, 1.21);
              currScene.position.set(-0.1*worldSize.w, -worldSize.h/2+0.2, 0);
              currScene.rotation.z = Math.PI;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'window1Rooms':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.55*worldSize.w/4;
              var h = 0.2*worldSize.h;
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-wallDepth/2-0.1, 5);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'window2Rooms':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.55*worldSize.w/4;
              var h = 0.2*worldSize.h;
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+w, worldSize.h/2-wallDepth/2-0.1, 5);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'window3Rooms':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.55*worldSize.w/4;
              var h = 0.2*worldSize.h;
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+2*w, worldSize.h/2-wallDepth/2-0.1, 5);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'window4Rooms':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.55*worldSize.w/4;
              var h = 0.2*worldSize.h;
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2+3*w, worldSize.h/2-wallDepth/2-0.1, 5);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'window14Rooms1':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(worldSize.w/2-wallDepth/2-0.1, worldSize.h/2-0.4*h, 5);
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'window14Rooms2':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(worldSize.w/2-wallDepth/2-0.1, worldSize.h/2-0.6*h, 5);
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'windowHall1':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var w = 0.2*worldSize.w;
              var h = 0.45*worldSize.h;
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(-worldSize.w/2+0.3*worldSize.w, -worldSize.h/2+wallDepth/2+0.1, 5);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'windowHall2':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(-worldSize.w/2+0.5*worldSize.w, -worldSize.h/2+wallDepth/2+0.1, 5);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'windowHall3':
            if (!loadObjects.window) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
              var padding = 5;
              var currScene = loadObjects.window.scene.clone();
              currScene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  child.receiveShadow = true;
                  if (child.name == "window3_0") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x363000, side: THREE.DoubleSide, skinning: true});
                  } else if (child.name == "window3_1") {
                    child.material = new THREE.MeshPhongMaterial({color: 0x1C340B, side: THREE.DoubleSide, skinning: true});
                  }
                }
              });
              objects[obj.id].size = {w: 5, h: 1, d: 5};
              currScene.scale.set(5, 5, 5);
              currScene.position.set(-worldSize.w/2+0.75*worldSize.w, -worldSize.h/2+wallDepth/2+0.1, 5);
              currScene.rotation.z = Math.PI/2;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].ghostMode = "1";
              objects[obj.id].sceneObj = currScene;
              setPlaceLayout(obj.id);
              scene.add(currScene);
            }
            break;
          case 'grass':
            if (!loadTextures.grass) {
              setTimeout(function() {addScene(objects[obj.id]);}, 2000);
            } else {
              var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
              var floorMaterial = new THREE.MeshPhongMaterial({map: loadTextures.grass, side: THREE.DoubleSide});
              var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
              objects[obj.id].size = {w: 300, h: 300, d: 0.1};
              floorObject.scale.set(300, 300, 1);
              floorObject.position.set(0, 0, -1);
              floorObject.receiveShadow = true;
              floorObject.castShadow = false;
              objects[obj.id].stopBullet = false;
              objects[obj.id].visibleThrough = true;
              objects[obj.id].sceneObj = floorObject;
              setPlaceLayout(obj.id);
              scene.add(floorObject);
            }
            break;
  }
}

var loadObjects = {
  doorKitchen: false,
  bath: false,
  toilet: false,
  sink: false,
  cupboard: false,
  bedsideTable: false,
  bed: false,
  tv: false,
  doorKitchen2: false,
  bath2: false,
  bath3: false,
  shower: false,
  sofa: false,
  poolTable: false,
  cctv: false,
  reception: false,
  chair: false,
  doorMain: false,
  window: false,
  human: false,
  tableRestaurant: false,
  counterbar: false,
  tableRestaurant2: false,
  washbanish: false,
  countertop: false,
  stove: false,
  frige: false,
  rack: false,
  tableKitchen: false
};
var loadTextures = {
  woodRack: false,
  floorBath: false,
  wallRooms: false,
  wallBath: false,
  bed: false,
  sofa: false,
  grass: false,
  human: false,
  eye: false,
  eye001: false,
  knife: false,
  floorHall: false,
  floorRestaurant: false,
  floorKitchen: false,
  floorRooms: false,
  floorSecurity: false,
  wallRestaurant: false,
  wallKitchen: false,
  wallHall: false,
  wallSecurity: false,
  chairRestaurant: false,
  tableRestaurant: false,
  counterbarCenter: false,
  counterbarSide: false,
  washbanish: false,
  countertop: false,
  stove: false,
  frige: false,
  woodRack: false,
  mettalRack: false
};

var currentProgress = 0;
var totalProgress = Object.keys(loadObjects).length;
var intervalProgress = setInterval(function() {
  if (!document.getElementById('loading')) {
    var loading = document.createElement("div");
    loading.setAttribute("id", "loading");
    loading.setAttribute("class", "disable-select");
    loading.style.width = "100%";
    loading.style.height = "100%";
    loading.style.position = "fixed";
    loading.style.left = "0px";
    loading.style.bottom = "0px";
    loading.style.display = "flex";
    loading.style.flexDirection = "column";
    loading.style.justifyContent = "center";
    loading.style.alignItems = "center";
    loading.style.fontSize = "16px";
    loading.style.fontFamily = "Arial";
    loading.style.color = "#fff";
    loading.style.fontWeight = "100";
    loading.style.backgroundColor = "#000";
    loading.style.zIndex = "1000";
    document.getElementById('guitag').appendChild(loading);
  }
  document.getElementById('loading').innerHTML = 'loading objects '+currentProgress+'/'+totalProgress;
  if (currentProgress >= totalProgress) {
    clearInterval(intervalProgress);
    document.getElementById('loading').remove();
  }
}, 500);
//function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }
//loading objects
new THREE.GLTFLoader().load('/g/stealth/resource/models/doorKitchen.glb', function(gltf) { loadObjects.doorKitchen = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function(err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/bath.glb', function(gltf) { loadObjects.bath = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/toilet.glb', function(gltf) { loadObjects.toilet = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/sink.glb', function(gltf) { loadObjects.sink = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/cupboard.glb', function(gltf) { loadObjects.cupboard = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/bedsideTable.glb', function(gltf) { loadObjects.bedsideTable = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/bed.glb', function(gltf) { loadObjects.bed = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/tv.glb', function(gltf) { loadObjects.tv = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/doorKitchen2.glb', function(gltf) { loadObjects.doorKitchen2 = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/bath2.glb', function(gltf) { loadObjects.bath2 = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/bath3.glb', function(gltf) { loadObjects.bath3 = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/shower.glb', function(gltf) { loadObjects.shower = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/sofa.glb', function(gltf) { loadObjects.sofa = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/poolTable.glb', function(gltf) { loadObjects.poolTable = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/cctv.glb', function(gltf) { loadObjects.cctv = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/reception.glb', function(gltf) { loadObjects.reception = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/chair.glb', function(gltf) { loadObjects.chair = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/doorMain.glb', function(gltf) { loadObjects.doorMain = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/window.glb', function(gltf) { loadObjects.window = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/human.glb', function(gltf) { loadObjects.human = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/tableRestaurant.glb', function(gltf) { loadObjects.tableRestaurant = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/counterbar.glb', function(gltf) { loadObjects.counterbar = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/tableRestaurant2.glb', function(gltf) { loadObjects.tableRestaurant2 = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/washbanish.glb', function(gltf) { loadObjects.washbanish = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/countertop.glb', function(gltf) { loadObjects.countertop = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/stove.glb', function(gltf) { loadObjects.stove = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/frige.glb', function(gltf) { loadObjects.frige = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/rack.glb', function(gltf) { loadObjects.rack = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
new THREE.GLTFLoader().load('/g/stealth/resource/models/tableKitchen.glb', function(gltf) { loadObjects.tableKitchen = gltf; }, function (xhr) { if (xhr.loaded == xhr.total) { currentProgress++; } }, function (err) { console.error(err); });
//loading textures
new THREE.TextureLoader().load('/g/stealth/resource/img/woodRack.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.woodRack = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/floorBath.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(2, -2); loadTextures.floorBath = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.wallRooms = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/wallBath.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.wallBath = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/bed.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.bed = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/sofa.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.sofa = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/grass.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(30, 30); loadTextures.grass = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/human.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.human = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/eye.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.eye = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/eye001.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.eye001 = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/knife.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.knife = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/floorHall.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.floorHall = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/floorRestaurant.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.floorRestaurant = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/floorKitchen.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.floorKitchen = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/floorRooms.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.floorRooms = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/floorSecurity.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.floorSecurity = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.wallRestaurant = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/wallKitchen.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.wallKitchen = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.wallHall = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/wallSecurity.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.wallSecurity = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/chairRestaurant.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.chairRestaurant = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/tableRestaurant.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.tableRestaurant = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/counterbarCenter.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.counterbarCenter = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/counterbarSide.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.counterbarSide = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/washbanish.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.washbanish = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/countertop.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.countertop = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/stove.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.stove = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/frige.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.frige = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/woodRack.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.woodRack = texture; }, undefined, function (err) { console.error(err); });
new THREE.TextureLoader().load('/g/stealth/resource/img/mettalRack.png', function(texture) { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.mapping = THREE.CubeUVReflectionMapping; texture.repeat.set(1, -1); loadTextures.mettalRack = texture; }, undefined, function (err) { console.error(err); });
