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
  if (objects[id].tag.substr(0, 4) == "wall") {
    if (objects[id].size.w > objects[id].size.h) {
      objects[id].sceneObj.rotation.z += -Math.PI/2;
    } else if (objects[id].size.w < objects[id].size.h) {
      objects[id].sceneObj.rotation.z += Math.PI/2;
    }
  } else {
    objects[id].sceneObj.rotation.z = Math.PI/2;
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
    case 'player':
      var loader = new THREE.GLTFLoader();
      loader.load('/g/stealth/resource/models/human.glb', function(gltf) {

        gltf.scene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshPhongMaterial({color: 0xFF0000, side: THREE.DoubleSide, skinning: true});
          }
        });
        gltf.scene.position.set(obj.coord.x, obj.coord.y, 0);
        gltf.scene.rotation.x = Math.PI/2;

        var mixer = new THREE.AnimationMixer(gltf.scene);

        objects[obj.id].animations = gltf.animations;
        objects[obj.id].sceneObj = gltf.scene;
        objects[obj.id].mixer = mixer;

        var loaderTexture = new THREE.TextureLoader();
        loaderTexture.load('/g/stealth/resource/models/texture.png', function (textureSkin) {
            textureSkin.wrapS = THREE.RepeatWrapping;
            textureSkin.wrapT = THREE.RepeatWrapping;
            textureSkin.mapping = THREE.CubeUVReflectionMapping;
            textureSkin.repeat.set(1, -1);
            loaderTexture.load('/g/stealth/resource/models/eye.png', function (textureEye) {
                textureEye.wrapS = THREE.RepeatWrapping;
                textureEye.wrapT = THREE.RepeatWrapping;
                textureEye.mapping = THREE.CubeUVReflectionMapping;
                textureEye.repeat.set(1, -1);
                loaderTexture.load('/g/stealth/resource/models/eye001.png', function (textureEye2) {
                    textureEye2.wrapS = THREE.RepeatWrapping;
                    textureEye2.wrapT = THREE.RepeatWrapping;
                    textureEye2.mapping = THREE.CubeUVReflectionMapping;
                    textureEye2.repeat.set(1, -1);
                    gltf.scene.traverse(function (child) {
                      if (child instanceof THREE.Mesh) {
                        if (child.name == "Sphere") {
                          child.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, skinning: true, map: textureEye});
                        } else if (child.name == "Sphere001") {
                          child.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, skinning: true, map: textureEye2});
                        } else {
                          child.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, skinning: true, map: textureSkin});
                        }
                      }
                    });
                    objects[obj.id].visibleThrough = true;
                    scene.add(gltf.scene);
                  },
                  undefined,
                  function (err) {
                    console.error(err);
                  }
                );
              },
              undefined,
              function (err) {
                console.error(err);
              }
            );
          },
          undefined,
          function (err) {
            console.error(err);
          }
        );
      }, undefined, function(err) {
        console.error(err);
      });

      break;
    case 'circle':
      var circleGeometry = new THREE.CircleBufferGeometry(10, 32);
      var circleMaterial = new THREE.MeshPhongMaterial({color: 0x0000FF, transparent: true, opacity: 0.1, side: THREE.DoubleSide});
      var circleObject = new THREE.Mesh(circleGeometry, circleMaterial);
      circleObject.position.set(objects[obj.id].coord.x, objects[obj.id].coord.y, 5);
      circleObject.visible = false;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = circleObject;
      scene.add(circleObject);
      break;
    case 'floorHall':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/floorHall.png');
      var floorGeometry = new THREE.PlaneGeometry(worldSize.w, worldSize.h, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
      var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
      floorObject.position.set(0, 0, -0.1);
      floorObject.texture = currTexture;
      floorObject.texture.wrapS = THREE.RepeatWrapping;
      floorObject.texture.wrapT = THREE.RepeatWrapping;
      floorObject.texture.repeat.set(30, 30);
      floorObject.receiveShadow = true;
      floorObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = floorObject;
      scene.add(floorObject);
      break;
    case 'floorRestaurant':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/floorRestaurant.png');
      var w = 0.2*worldSize.w;
      var h = 0.8*worldSize.h;
      var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
      var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
      floorObject.scale.set(w, h, 1);
      floorObject.position.set(-worldSize.w/2+w/2, -worldSize.h/2+h/2, 0);
      floorObject.texture = currTexture;
      floorObject.texture.wrapS = THREE.RepeatWrapping;
      floorObject.texture.wrapT = THREE.RepeatWrapping;
      floorObject.texture.repeat.set(4, 16);
      floorObject.texture.rotateable = true;
      floorObject.receiveShadow = true;
      floorObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = floorObject;
      setPlaceLayout(obj.id);
      scene.add(floorObject);
      break;
    case 'floorKitchen':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/floorKitchen.png');
      var w = 0.2*worldSize.w;
      var h = 0.2*worldSize.h;
      var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
      var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
      floorObject.scale.set(w, h, 1);
      floorObject.position.set(-worldSize.w/2+w/2, worldSize.h/2-h/2, 0);
      floorObject.texture = currTexture;
      floorObject.texture.wrapS = THREE.RepeatWrapping;
      floorObject.texture.wrapT = THREE.RepeatWrapping;
      floorObject.texture.repeat.set(4, 4);
      floorObject.texture.rotateable = true;
      floorObject.receiveShadow = true;
      floorObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = floorObject;
      setPlaceLayout(obj.id);
      scene.add(floorObject);
      break;
    case 'floorRoomsPart1':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/floorRooms.png');
      var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.w};
      var w = 0.55*worldSize.w;
      var h = 0.2*worldSize.h;
      var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
      var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
      floorObject.scale.set(w, h, 1);
      floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h/2, 0);
      floorObject.texture = currTexture;
      floorObject.texture.wrapS = THREE.RepeatWrapping;
      floorObject.texture.wrapT = THREE.RepeatWrapping;
      floorObject.texture.repeat.set(11, 4);
      floorObject.texture.rotateable = true;
      floorObject.receiveShadow = true;
      floorObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = floorObject;
      setPlaceLayout(obj.id);
      scene.add(floorObject);
      break;
    case 'floorRoomsPart2':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/floorRooms.png');
      var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.w};
      var w = 0.2*worldSize.w;
      var h = 0.45*worldSize.h;
      var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
      var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
      floorObject.scale.set(w, h, 1);
      floorObject.position.set(worldSize.w/2-w/2, worldSize.h/2-h/2, 0);
      floorObject.texture = currTexture;
      floorObject.texture.wrapS = THREE.RepeatWrapping;
      floorObject.texture.wrapT = THREE.RepeatWrapping;
      floorObject.texture.repeat.set(4, 9);
      floorObject.texture.rotateable = true;
      floorObject.receiveShadow = true;
      floorObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = floorObject;
      setPlaceLayout(obj.id);
      scene.add(floorObject);
      break;
    case 'floorRoomsPart3':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/floorRooms.png');
      var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.h};
      var sizeBigRoom = {w: 0.2*worldSize.w, h: 0.45*worldSize.h};
      var w = 0.55*worldSize.w;
      var h = 0.2*worldSize.h;
      var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
      var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
      floorObject.scale.set(w, h, 1);
      floorObject.position.set(-worldSize.w/2+sizeKitchen.w+0.05*worldSize.w+w/2, worldSize.h/2-h-0.05*worldSize.w-h/2, 0);
      floorObject.texture = currTexture;
      floorObject.texture.wrapS = THREE.RepeatWrapping;
      floorObject.texture.wrapT = THREE.RepeatWrapping;
      floorObject.texture.repeat.set(11, 4);
      floorObject.texture.rotateable = true;
      floorObject.receiveShadow = true;
      floorObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = floorObject;
      setPlaceLayout(obj.id);
      scene.add(floorObject);
      break;
    case 'floorRoomsPart4':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/floorRooms.png');
      var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.w};
      var w = 0.75*worldSize.w;
      var h = 0.2*worldSize.h;
      var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
      var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
      floorObject.scale.set(w, h, 1);
      floorObject.position.set(worldSize.w/2-w/2, worldSize.h/2-2*h-2*0.05*worldSize.h-h/2, 0);
      floorObject.texture = currTexture;
      floorObject.texture.wrapS = THREE.RepeatWrapping;
      floorObject.texture.wrapT = THREE.RepeatWrapping;
      floorObject.texture.repeat.set(15, 4);
      floorObject.texture.rotateable = true;
      floorObject.receiveShadow = true;
      floorObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = floorObject;
      setPlaceLayout(obj.id);
      scene.add(floorObject);
      break;
    case 'floorSecurity':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/floorSecurity.png');
      var sizeKitchen = {w: 0.2*worldSize.w, h: 0.2*worldSize.w};
      var w = 0.1*worldSize.w;
      var h = 0.3*worldSize.h;
      var floorGeometry = new THREE.PlaneGeometry(1, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({map: currTexture, side: THREE.DoubleSide});
      var floorObject = new THREE.Mesh(floorGeometry, floorMaterial);
      floorObject.scale.set(w, h, 1);
      floorObject.position.set(worldSize.w/2-w/2, -worldSize.h/2+h/2, 0);
      floorObject.texture = currTexture;
      floorObject.texture.wrapS = THREE.RepeatWrapping;
      floorObject.texture.wrapT = THREE.RepeatWrapping;
      floorObject.texture.repeat.set(2, 6);
      floorObject.receiveShadow = true;
      floorObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].sceneObj = floorObject;
      setPlaceLayout(obj.id);
      scene.add(floorObject);
      break;
    case 'wallRestaurant1':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(16, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRestaurant2':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(4, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRestaurant3':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallKitchen.png');
      var w = 0.2*worldSize.w;
      var h = 0.8*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(door.pos*w-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
      wallObject.position.set(-worldSize.w/2+(door.pos*w-door.width/2)/2, -worldSize.h/2+h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRestaurant4':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallKitchen.png');
      var w = 0.2*worldSize.w;
      var h = 0.8*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width+2*deltaBug, wallDepth, 2);
      wallObject.position.set(-worldSize.w/2+door.pos*w, -worldSize.h/2+h, 9);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRestaurant5':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallKitchen.png');
      var w = 0.2*worldSize.w;
      var h = 0.8*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
      wallObject.position.set(-worldSize.w/2+door.pos*w+door.width/2+(w-door.pos*w-door.width/2+wallDepth/2)/2, -worldSize.h/2+h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRestaurant6':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.8*worldSize.h;
      var door = {pos: 0.1, width: 6};
      objects[obj.id].size = {w: wallDepth, h: door.pos*h-door.width/2+wallDepth/2, d: 10};
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
      wallObject.scale.set(door.pos*h-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
      wallObject.position.set(-worldSize.w/2+w, -worldSize.h/2+(door.pos*h-door.width/2)/2, 5);
      wallObject.rotation.z = -Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(2, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(4, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRestaurant7':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.8*worldSize.h;
      var door = {pos: 0.1, width: 6};
      objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
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
      wallObject.scale.set(door.width+2*deltaBug, wallDepth, 2);
      wallObject.position.set(-worldSize.w/2+w, -worldSize.h/2+door.pos*h, 9);
      wallObject.rotation.z = -Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRestaurant8':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRestaurant.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.8*worldSize.h;
      var door = {pos: 0.1, width: 6};
      objects[obj.id].size = {w: wallDepth, h: h-door.pos*h-door.width/2+wallDepth/2, d: 10};
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
      wallObject.scale.set(h-door.pos*h-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
      wallObject.position.set(-worldSize.w/2+w, -worldSize.h/2+door.pos*h+door.width/2+(h-door.pos*h-door.width/2+wallDepth/2)/2, 5);
      wallObject.rotation.z = -Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(14, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(28, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallKitchen1':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallKitchen.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(16, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallKitchen2':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallKitchen.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(16, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallKitchen3':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallKitchen.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(-worldSize.w/2+w, worldSize.h/2-h/2, 5);
      wallObject.rotation.z = -Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(14, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(28, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms1':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.2*worldSize.w;
      var h = 0.45*worldSize.h;
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
      wallObject.position.set(worldSize.w/2, worldSize.h/2-h/2, 5);
      wallObject.rotation.z = -Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(16, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms2':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.75*worldSize.w;
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
      wallObject.position.set(worldSize.w/2-w/2, worldSize.h/2, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(26, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms3':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: w+wallDepth, h: wallDepth, d: 10};
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
      wallObject.scale.set(w+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-w/2, worldSize.h/2-h-0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(16, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(28, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms4':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.65*worldSize.w;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: w+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.1*worldSize.w-w/2-wallDepth/4+deltaBug, worldSize.h/2-3*h-2*0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(16, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(24, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms5':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallSecurity.png');
      var w = 0.1*worldSize.w;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: w+wallDepth, h: wallDepth, d: 10};
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
      wallObject.scale.set(w+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-w/2+wallDepth/4, worldSize.h/2-3*h-2*0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(4, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms6':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth/2, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w, worldSize.h/2-h/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms7':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-w, worldSize.h/2-h/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms8':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-2*w, worldSize.h/2-h/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms9':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-3*w, worldSize.h/2-h/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms10':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-4*w, worldSize.h/2-h/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(10, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms11':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w, worldSize.h/2-h-0.05*worldSize.h-h/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms12':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms13':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-2*w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms14':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-3*w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms15':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-3*w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms16':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-4*w, worldSize.h/2-h/2-h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(10, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms17':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.position.set(worldSize.w/2, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.rotation.z = -Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms18':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms19':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms20':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-2*w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms21':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-3*w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms22':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      objects[obj.id].size = {w: wallDepth, h: h+wallDepth-deltaBug, d: 10};
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
      wallObject.scale.set(h+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-4*w, worldSize.h/2-h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(10, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms23':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.45*worldSize.h;
      objects[obj.id].size = {w: w+wallDepth-deltaBug, h: wallDepth, d: 10};
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
      wallObject.scale.set(w+wallDepth-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-w/2, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(6, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(10, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms24':// 4 12
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms25':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w, worldSize.h/2-h, 9);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms26':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms27':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-w, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms28':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-w, worldSize.h/2-h, 9);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms29':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-w, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms30':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-2*w, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms31':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-2*w, worldSize.h/2-h, 9);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms32':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-2*w, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms33':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-3*w, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms34':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-3*w, worldSize.h/2-h, 9);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms35':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-wallDepth/4+deltaBug-3*w, worldSize.h/2-h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms36':// this start
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug, worldSize.h/2-2*h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms37':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w, worldSize.h/2-2*h-0.05*worldSize.h, 9);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms38':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2, worldSize.h/2-2*h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms39':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms40':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-w, worldSize.h/2-2*h-0.05*worldSize.h, 9);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms41':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms42':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-2*w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms43':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-2*w, worldSize.h/2-2*h-0.05*worldSize.h, 9);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms44':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-2*w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms45':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-3*w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms46':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-3*w, worldSize.h/2-2*h-0.05*worldSize.h, 9);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms47':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-wallDepth/4+deltaBug-3*w, worldSize.h/2-2*h-0.05*worldSize.h, 5);
      wallObject.rotation.z = Math.PI;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms48':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms49':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms50':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms51':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms52':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms53':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms54':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-2*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms55':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-2*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms56':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-2*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms57':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/2-deltaBug-3*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms58':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-3*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms59':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.55*worldSize.w/4;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.7, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-0.2*worldSize.w-door.pos*w-door.width/2-(w-door.pos*w-door.width/2)/2-wallDepth/4+deltaBug-3*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms60':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.8, width: 6};
      objects[obj.id].size = {w: w*door.pos-door.width/2+wallDepth, h: wallDepth, d: 10};
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
      wallObject.scale.set(w*door.pos-door.width/2+wallDepth, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-(w*door.pos-door.width/2+wallDepth/2)/2+wallDepth/4, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(3, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(6, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms61':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.8, width: 6};
      objects[obj.id].size = {w: door.width, h: wallDepth, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-door.pos*w, worldSize.h/2-2*h-2*0.05*worldSize.h, 9);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms62':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.2*worldSize.h;
      var door = {pos: 0.8, width: 6};
      objects[obj.id].size = {w: w-door.pos*w-door.width/2+wallDepth/2, h: wallDepth, d: 10};
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
      wallObject.scale.set(w-door.pos*w-door.width/2+wallDepth/2, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-door.pos*w-door.width/2-(w-door.pos*w-door.width/2+wallDepth/2)/2, worldSize.h/2-2*h-2*0.05*worldSize.h, 5);
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms63':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.45*worldSize.h;
      var door = {pos: 0.5, width: 6};
      objects[obj.id].size = {w: wallDepth, h: (0.05*worldSize.h-door.width-wallDepth)/2, d: 10};
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
      wallObject.scale.set((0.05*worldSize.h-door.width-wallDepth)/2+deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-w, worldSize.h/2-door.pos*h+door.width/2+((0.05*worldSize.h-door.width-wallDepth)/2)/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(0.2, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms64':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.45*worldSize.h;
      var door = {pos: 0.5, width: 6};
      objects[obj.id].size = {w: wallDepth, h: (0.05*worldSize.h-door.width-wallDepth)/2, d: 10};
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
      wallObject.scale.set((0.05*worldSize.h-door.width-wallDepth)/2+deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-w, worldSize.h/2-door.pos*h-door.width/2-((0.05*worldSize.h-door.width-wallDepth)/2)/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(0.2, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallRooms65':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallRooms.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.2*worldSize.w;
      var h = 0.45*worldSize.h;
      var door = {pos: 0.5, width: 6};
      objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
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
      wallObject.scale.set(door.width, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-w, worldSize.h/2-door.pos*h, 9);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallSecurity1':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallSecurity.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(12, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = false;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallSecurity2':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallSecurity.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(4, 1);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallSecurity3':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallSecurity.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.1*worldSize.w;
      var h = 0.3*worldSize.h;
      var door = {pos: 0.8, width: 6};
      objects[obj.id].size = {w: wallDepth, h: door.pos*h-door.width/2+wallDepth/2-deltaBug, d: 10};
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
      wallObject.scale.set(door.pos*h-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-w, -worldSize.h/2+(door.pos*h-door.width/2+wallDepth/2)/2-wallDepth/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(9, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(9, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallSecurity4':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallSecurity.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.1*worldSize.w;
      var h = 0.3*worldSize.h;
      var door = {pos: 0.8, width: 6};
      objects[obj.id].size = {w: wallDepth, h: door.width, d: 2};
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
      wallObject.scale.set(door.width+deltaBug, wallDepth, 2);
      wallObject.position.set(worldSize.w/2-w, -worldSize.h/2+door.pos*h, 9);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(1, 0.3);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 0.6);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = true;
      objects[obj.id].ghostMode = "1";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallSecurity5':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallSecurity.png');
      var currTexture2 = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
      var w = 0.1*worldSize.w;
      var h = 0.3*worldSize.h;
      var door = {pos: 0.8, width: 6};
      objects[obj.id].size = {w: wallDepth, h: h-door.pos*h-door.width/2+wallDepth/2-deltaBug, d: 10};
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
      wallObject.scale.set(h-door.pos*h-door.width/2+wallDepth/2-deltaBug, wallDepth, 10);
      wallObject.position.set(worldSize.w/2-w, -worldSize.h/2+door.pos*h+door.width/2+(h-door.pos*h-door.width/2+wallDepth/2)/2, 5);
      wallObject.rotation.z = Math.PI/2;
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(2, 1);
      currTexture2.wrapS = THREE.RepeatWrapping;
      currTexture2.wrapT = THREE.RepeatWrapping;
      currTexture2.repeat.set(2, 2);
      wallObject.receiveShadow = true;
      wallObject.castShadow = true;
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallHall1':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(28, 2);
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallHall2':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(2, 2);
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
    case 'wallHall3':
      var currTexture = new THREE.TextureLoader().load('/g/stealth/resource/img/wallHall.png');
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
      wallObject.texture = currTexture;
      wallObject.texture.wrapS = THREE.RepeatWrapping;
      wallObject.texture.wrapT = THREE.RepeatWrapping;
      wallObject.texture.repeat.set(2, 2);
      objects[obj.id].visibleThrough = false;
      objects[obj.id].ghostMode = "2";
      objects[obj.id].sceneObj = wallObject;
      setPlaceLayout(obj.id);
      scene.add(wallObject);
      break;
  }
}
