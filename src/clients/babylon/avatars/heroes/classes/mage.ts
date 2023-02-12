import { Axis, InstantiatedEntries, Mesh, Scene } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { scene } from "../../../main";
import { ModelEnum } from "../../../others/models";
import { distance, isInCone } from "../../../others/tools";
import { Fireball } from "../../weapons/projectiles/fireball";
import { Player } from "../player";
import { CharacterState } from "../../avatarSoft";

export class Mage extends Player {
    modelContainer: InstantiatedEntries;
    constructor(scene: Scene, avatar_username: string) {
        var modelContainer = ModelEnum.Ranger.duplicate(ModelEnum.Ranger.container)
        super(scene, avatar_username, modelContainer.rootNodes[0] as Mesh, 90, 0.2)

        this.modelContainer = modelContainer

        this.class = "Mage"

        this.tableAttackcd[0] = 1500
        this.tableAttackcd[1] = 8000
    }

    attack_0(onlyDisplay = false) {
        console.log("mage ", this.name, " casts normal attack");
        scene.projectileList.push(new Fireball(this, onlyDisplay, {}))
        this.modelContainer.animationGroups[0].start()
        this.canMove = false;
        this.status = CharacterState.Punching
        setTimeout(() => {
            this.canMove = true
            this.status = CharacterState.Idle
        }, 1000)
    }

    attack_1(onlyDisplay = false) {
        //long cone infligeant un burst de degats et l'etat brulure, poussant les ennemis
        console.log("mage ", this.name, " casts special attack");

        //ANIMATION (TODO)

        //DAMAGE
        if (!onlyDisplay) {
            wsClient.monster_list.forEach(monster => {
                if (isInCone(monster.shape.position, this.shape.position, 10, this.shape.getDirection(Axis.Z), 1, Math.PI / 3)) {
                    console.log("distance Mage-Monstre: ", distance(this.shape.position, monster.shape.position));
                    monster.take_damage(this.shape.position, 10, (10 - distance(this.shape.position, monster.shape.position, true)) / 2);
                    monster.triggerStatus("burn");
                }
            })
        }
    }

    walk_anim(on: boolean) {
        if (on && this.status != CharacterState.Walking_fw) {
            this.modelContainer.animationGroups[1].start()
            this.modelContainer.animationGroups[1].loopAnimation = true;
            this.status = CharacterState.Walking_fw
        } else if (!on && this.status == CharacterState.Walking_fw) {
            this.modelContainer.animationGroups[1].stop()
            this.status = CharacterState.Idle
        }
    }

    animate_from_status() {
        switch (this.status) {
            case CharacterState.Walking_bw:
                break
            case CharacterState.Walking_fw:
                this.modelContainer.animationGroups[1].start()
                break
            case CharacterState.Running:
                break
            case CharacterState.Falling:
                break
            case CharacterState.Idle:
                break
            case CharacterState.Jumping:
                break
            case CharacterState.Punching:
                break
            case CharacterState.Swimming:
                break
            default:
                console.log("error animation: " + this.name + " in status " + this.status);

        }
    }
}