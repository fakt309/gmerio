var setAnimationPlayer = function(obj) {
  if (typeof obj.activeAnimation == "undefined") {
    obj.activeAnimation = 'Forward';
    showGuiWeapon(1);
    showGuiBullets();
  }
  if ((obj.speed.x == 0 && obj.speed.y == 0 && obj.activeAnimation != 'Standing' && (!obj.aiming || (obj.aiming && obj.activeWeapon == 2)) )) {
    obj.mixer.stopAllAction();
    obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'Standing')).play();
    obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunStanding')).play();
    obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeStanding')).play();
    obj.activeAnimation = 'Standing';
  } else if ((obj.speed.x == 0 && obj.speed.y == 0 && obj.activeAnimation != 'StandAiming' && obj.aiming && obj.activeWeapon == 1)) {
    obj.mixer.stopAllAction();
    obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'StandAiming')).play();
    obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
    obj.activeAnimation = 'StandAiming';
  } else if (obj.speed.x != 0 || obj.speed.y != 0) {

    var directionKey = 0;
    if (obj.speed.x > 0 && obj.speed.y == 0) {
      directionKey = 1;
    } else if (obj.speed.x > 0 && obj.speed.y > 0) {
      directionKey = 2;
    } else if (obj.speed.x == 0 && obj.speed.y > 0) {
      directionKey = 3;
    } else if (obj.speed.x < 0 && obj.speed.y > 0) {
      directionKey = 4;
    } else if (obj.speed.x < 0 && obj.speed.y == 0) {
      directionKey = 5;
    } else if (obj.speed.x < 0 && obj.speed.y < 0) {
      directionKey = 6;
    } else if (obj.speed.x == 0 && obj.speed.y < 0) {
      directionKey = 7;
    } else if (obj.speed.x > 0 && obj.speed.y < 0) {
      directionKey = 8;
    }

    if (!obj.aiming) {
      if (obj.activeAnimation != 'Forward' && obj.lookingDirect == directionKey) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'VerticalWalk')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunWalking')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'Forward';
      } else if (obj.activeAnimation != 'ForwardRight' && (obj.lookingDirect-directionKey == 1 || obj.lookingDirect-directionKey == -7)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'DiagonalWalk1')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunWalking')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'ForwardRight';
      } else if (obj.activeAnimation != 'ForwardLeft' && (obj.lookingDirect-directionKey == -1 || obj.lookingDirect-directionKey == 7)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'DiagonalWalk2')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunWalking')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'ForwardLeft';
      } else if (obj.activeAnimation != 'Back' && Math.abs(obj.lookingDirect-directionKey) == 4) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'VerticalWalk')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunWalking')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'Back';
      } else if (obj.activeAnimation != 'BackRight' && (obj.lookingDirect-directionKey == -5 || obj.lookingDirect-directionKey == 3 )) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'DiagonalWalk2')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunWalking')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'BackRight';
      } else if (obj.activeAnimation != 'BackLeft' && (obj.lookingDirect-directionKey == -3 || obj.lookingDirect-directionKey == 5)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'DiagonalWalk1')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunWalking')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'BackLeft';
      } else if (obj.activeAnimation != 'Right' && (obj.lookingDirect-directionKey == 2 || obj.lookingDirect-directionKey == -6)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'HorizontalWalk')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunWalking')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'Right';
      } else if (obj.activeAnimation != 'Left' && (obj.lookingDirect-directionKey == -2 || obj.lookingDirect-directionKey == 6)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'HorizontalWalk')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunWalking')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'Left';
      }
    } else if (obj.aiming && obj.activeWeapon == 1) {
      if (obj.activeAnimation != 'ForwardAiming' && obj.lookingDirect == directionKey) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'VerticalAimingWalk')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'ForwardAiming';
      } else if (obj.activeAnimation != 'ForwardRightAiming' && (obj.lookingDirect-directionKey == 1 || obj.lookingDirect-directionKey == -7)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'DiagonalAimingWalk1')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'ForwardRightAiming';
      } else if (obj.activeAnimation != 'ForwardLeftAiming' && (obj.lookingDirect-directionKey == -1 || obj.lookingDirect-directionKey == 7)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'DiagonalAimingWalk2')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'ForwardLeftAiming';
      } else if (obj.activeAnimation != 'BackAiming' && Math.abs(obj.lookingDirect-directionKey) == 4) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'VerticalAimingWalk')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'BackAiming';
      } else if (obj.activeAnimation != 'BackRightAiming' && (obj.lookingDirect-directionKey == -5 || obj.lookingDirect-directionKey == 3 )) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'DiagonalAimingWalk2')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'BackRightAiming';
      } else if (obj.activeAnimation != 'BackLeftAiming' && (obj.lookingDirect-directionKey == -3 || obj.lookingDirect-directionKey == 5)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'DiagonalAimingWalk1')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'BackLeftAiming';
      } else if (obj.activeAnimation != 'RightAiming' && (obj.lookingDirect-directionKey == 2 || obj.lookingDirect-directionKey == -6)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'HorizontalAimingWalk')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'RightAiming';
      } else if (obj.activeAnimation != 'LeftAiming' && (obj.lookingDirect-directionKey == -2 || obj.lookingDirect-directionKey == 6)) {
        obj.mixer.stopAllAction();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'HorizontalAimingWalk')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'GunAiming')).play();
        obj.mixer.clipAction(THREE.AnimationClip.findByName(obj.animations, 'KnifeWalking')).play();
        obj.activeAnimation = 'LeftAiming';
      }
    }

  }
};
