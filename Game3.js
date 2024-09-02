import  {Bodies, Body, Events, Engine, Render, Runner, World} from "matter-js";
import {FRUITS_BASE, FRUITS_HLW} from "./Game3_fruits";
import bodyParser from "body-parser";


const engine = Engine.create();
const render = Render.create({
engine,
element: document.body,
option:{
    wireframes: false,
    background:"#F7F4C8",
    width: 620,
    height: 850,
    }
});

const world = engine.world;

const leftWalll = Bodies.rectangle(15,395,30,790, {
    isStaitc: true,
    render:{fillStyle:"#E66666"}
});

const rightWalll = Bodies.rectangle(15,395,30,790, {
    isStaitc: true,
    render:{fillStyle:"#E66666"}
});

const ground = Bodies.rectangle(310,820,620,60, {
    isStaitc: true,
    isSensor: true,
    render:{fillStyle:"#E66666"}
});

const topLine = Bodies.rectangle(310,150,620,2, {
    name: topLine,
    isStaitc: true,
    render: { fillStyle:"#E6b143"}
}); 

World.add(world, [leftWalll, rightWalll, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction

function addFruit() {
    const index = (Math.random()*5);
    const fruit = FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true,
        render: {
            sprite: { texture:`${fruit.name}.png`}
        },
        restitution: 0.25,
        });
    
 currentBody = body;
 currentFruit =fruit;
   
World.add(world, body);
}

window.onkeydown = (event) => {
    if (disableAction) {
        return;
    }

    switch(event.code) {
        case "KeyA":
            if (currentBody.position.x - currentFruit.radius >30)
            Body.setPosition(currentBody,{
                x: currentBody.position.x - 10,
                y: currentBody.position.y,
            });
            break;
        case "KeyD":
            if (currentBody.position.x - currentFruit.radius < 590)
            Body.setPosition(currentBody,{
                x: currentBody.position.x + 10,
                y: currentBody.position.y,
            });
            break;

        case "KeyS":
            currentBody.isSleeping = false;
            disableAction = true;
            setTimeout(()=> {
                addFruit();
                disableAction = false;
            }, 1000);
            break;   
    }
}

Events.on(engine,"collisionStart", (event) => {
    event.pairs.forEach((collision)=>{
        if(collision.bodyA.index === collision.bodyB.index) {
            const index =collision.bodyA.index;

            if (index === FRUITS.length -1) {
                return;
            }

            World.remove(world,[collision.bodyA, collision.bodyB]);

            const newFruit = FRUITS[index +1];
           
            const newBody = Bodies.circle(
                collision.collision.support[0].x,
                collision.collision.support[0].y,
                newFruit.radius,
                {
                    render: {
                        sprite: { texture:`${newFruit.name}.png`}
                    },  
                    index: index +1,
                }
            );
            World.add(world, newBody);
        }  

        if (
        !disableAction &&
        (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
        alert("Gameover");
        }   
    });
});

addFruit();
 
